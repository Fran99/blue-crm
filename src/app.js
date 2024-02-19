const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const helmet = require('helmet');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');

const app = express();
app.use(bodyParser.json(), helmet());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * Gets all the contracts for a given Client or Contractor
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const { id: profileId } = req.profile;
  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [
        { ContractorId: profileId },
        { ClientId: profileId },
      ],
    },
  });
  if (!contract) return res.status(404).end();
  return res.json(contract);
});

// GET /contracts - Returns a list of contracts belonging to a user (client or contractor),
// the list should only contain non terminated contracts.
app.get('/contracts', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id: profileId } = req.profile;
  const contracts = await Contract.findAll({
    where:
    {
      [Op.or]: [
        { ContractorId: profileId },
        { ClientId: profileId },
      ],
    },
  });
  return res.json(contracts);
});

// GET /jobs/unpaid - Get all unpaid jobs for a user (either a client or contractor),
// for active contracts only.
app.get('/jobs/unpaid', getProfile, async (req, res) => {
  const { Job, Contract } = req.app.get('models');
  const { id: profileId } = req.profile;
  const jobs = await Job.findAll({
    where: {
      paid: null,
    },
    include: [{
      model: Contract,
      where: {
        status: 'in_progress',
        [Op.or]: [
          { ContractorId: profileId },
          { ClientId: profileId },
        ],
      },
    }],

  });

  return res.json({
    jobs,
  });
});

// POST /jobs/:job_id/pay - Pay for a job, a client can only pay if his balance >= the amount to pay
// The amount should be moved from the client's balance to the contractor balance.
app.post('/jobs/:jobId/pay', getProfile, async (req, res) => {
  const { id: profileId } = req.profile;
  const { Profile, Job, Contract } = req.app.get('models');
  const { jobId } = req.params;

  const clientProfilePromise = Profile.findOne({
    where: { id: profileId },
  });

  const jobPromise = Job.findOne({
    include: [{ model: Contract }],
    where: { id: +jobId },
  });

  const [clientProfile, job] = await Promise.all([clientProfilePromise, jobPromise]);

  if (!job) { return res.status(404).end(); }

  const contractorProfile = await Profile.findOne({
    where: { id: job.Contract.ClientId },
  });

  // Check if job is already paid
  if (+job.paid === 1) {
    return res.status(400).json({
      error: 'This job has already been paid',
    });
  }

  // Check for positive balance
  if (+clientProfile.balance < +job.price) {
    return res.status(400).json(
      {
        error: 'Not enough funds',
      },

    );
  }

  const t = await sequelize.transaction();

  try {
    // Subtract money from client
    clientProfile.balance -= +job.price;
    // Add money to contractor
    contractorProfile.balance += +job.price;
    // Update paid status
    job.paid = 1;

    await Promise.all([
      clientProfile.save({ transaction: t }),
      contractorProfile.save({ transaction: t }),
      job.save({ transaction: t }),
    ]);

    await t.commit();
  } catch (error) {
    await t.rollback();
  }

  return res.json({
    message: 'The payment has been made successfully',
  });
});

// POST /balances/deposit/:userId - Deposits money into the balance of a client,
// a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
  console.log(1);
  const { Profile, Job, Contract } = req.app.get('models');
  const userId = +req.params.userId;
  const { amount } = req.body;

  const client = await Profile.findOne({
    where: {
      id: userId,
      type: 'client',
    },
  });

  const clientContracts = await Contract.findAll({
    where: { ClientId: userId },
  });

  const clientContractsIds = clientContracts.reduce((pv, cv) => {
    pv.push(cv.id);
    return pv;
  }, []);

  const totalOfJobsToPay = await Job.sum('price', {
    where: {
      paid: {
        [Op.not]: true,
      },
      ContractId: {
        [Op.in]: clientContractsIds,
      },
    },
  });

  if (amount > totalOfJobsToPay * 0.25) {
    return res.status(400).json({
      error: `Can't deposit more than 25% of your total of jobs to pay [${totalOfJobsToPay * 0.25}]`,
    });
  }

  client.balance += amount;
  await client.save();

  return res.json({
    message: 'The balance has been updated',
  });
});

module.exports = app;
