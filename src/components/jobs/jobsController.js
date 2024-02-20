const { Op } = require('sequelize');
const { sequelize } = require('../../model');

module.exports = {

  /**
   *
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  async unpaid(req, res) {
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
          [Op.and]: {
            [req.profile.idType]: profileId,
          },
        },
      }],

    });

    return res.json(jobs);
  },

  async pay(req, res) {
    const { id: profileId } = req.profile;
    const { Profile, Job, Contract } = req.app.get('models');
    const { jobId } = req.params;

    const clientProfilePromise = Profile.findOne({
      where: { id: profileId },
    });

    const jobPromise = Job.findOne({
      include: [{
        model: Contract,
        where: {
          ClientId: profileId,
        },
      }],
      where: {
        id: +jobId,
      },
    });

    const [clientProfile, job] = await Promise.all([clientProfilePromise, jobPromise]);

    if (!job) { return res.status(404).end(); }

    const contractorProfile = await Profile.findOne({
      where: { id: job.Contract.ContractorId },
    });

    // Check if job is already paid
    if (+job.paid === 1) {
      return res.status(400).json({
        error: 'This job has already been paid',
      });
    }

    // Check for positive balance
    if (+clientProfile.balance < +job.price) {
      return res.status(400).json({ error: 'Not enough funds' });
    }

    const t = await sequelize.transaction();

    try {
      // Subtract money from client
      clientProfile.balance -= +job.price;
      // Add money to contractor
      contractorProfile.balance += +job.price;
      // Update paid status
      job.paid = 1;
      job.paymentDate = (new Date()).toISOString();

      await Promise.all([
        clientProfile.save({ transaction: t }),
        contractorProfile.save({ transaction: t }),
        job.save({ transaction: t }),
      ]);

      await t.commit();
    } catch (error) {
      await t.rollback();
      return res.status(404).end();
    }

    return res.json({
      message: 'The payment has been made successfully',
    });
  },

};
