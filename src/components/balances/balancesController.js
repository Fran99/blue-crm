const { Op } = require('sequelize');

module.exports = {

  /**
   * Make a deposit to a clients balance.
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  async deposit(req, res) {
    const { Profile, Job, Contract } = req.app.get('models');
    const userId = +req.params.userId;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        error: 'Please include a valid amount',
      });
    }

    const client = await Profile.findOne({
      where: {
        id: userId,
        type: 'client',
      },
    });

    if (!client) { return res.status(404).end(); }

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
