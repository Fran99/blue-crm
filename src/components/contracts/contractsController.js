const { Op } = require('sequelize');

module.exports = {

  /**
   *
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  async findAll(req, res) {
    const { Contract, Job } = req.app.get('models');
    const { id: profileId } = req.profile;
    const contracts = await Contract.findAll({
      include: [Job],
      where: {
        status: {
          [Op.not]: 'terminated',
        },
        [Op.and]: {
          [req.profile.idType]: profileId,
        },
      },
    });
    return res.json(contracts);
  },

  /**
   *
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  async findOne(req, res) {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const { id: profileId } = req.profile;

    const contract = await Contract.findOne({
      where: {
        id,
        [Op.and]: {
          [req.profile.idType]: profileId,
        },
      },
    });
    if (!contract) return res.status(404).end();
    return res.json(contract);
  },
};
