const { sequelize } = require('../../model');

module.exports = {

  /**
   * Returns what would be the best profession based on the amount generated
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  async bestProfession(req, res) {
    const start = req.query.start || 0;
    const end = req.query.end || (new Date()).toISOString();

    const result = await sequelize.query(
      `SELECT p.profession, SUM(j.price) AS totalEarned
       FROM Profiles p
       JOIN Contracts c ON p.id = c.ContractorId
       JOIN Jobs j ON c.id = j.ContractId
       WHERE j.paid = 1 
       AND j.paymentDate IS NOT NULL
       AND j.paymentDate BETWEEN "${start}" AND "${end}"
       GROUP BY p.profession 
       ORDER BY totalEarned DESC
       LIMIT 1;`,
    );

    return res.json(result[0][0]);
  },

  /**
   * Returns which would be the best customers based on the amount spent
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  async bestClients(req, res) {
    const start = req.query.start || 0;
    const end = req.query.end || (new Date()).toISOString();
    const limit = req.query.limit || 2;

    const result = await sequelize.query(
      `SELECT p.id, firstname || ' ' || lastname AS fullname, SUM(j.price) AS paid
       FROM Profiles p
       JOIN Contracts c ON p.id = c.ClientId
       JOIN Jobs j ON c.id = j.ContractId
       WHERE j.paid = 1 
       AND j.paymentDate IS NOT NULL
       AND j.paymentDate BETWEEN "${start}" AND "${end}"
       GROUP BY p.id 
       ORDER BY paid DESC
       LIMIT ${limit};`,
    );

    return res.json(result[0]);
  },
};
