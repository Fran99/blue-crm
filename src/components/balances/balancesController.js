const { Op } = require('sequelize');

module.exports = {

  async deposit(req, res) {
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
  },

};