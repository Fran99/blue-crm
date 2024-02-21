const { Op, Sequelize } = require('sequelize');
const {
  Contract, sequelize, Job, Profile,
} = require('../../model');

module.exports = {
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

  async bestClient(req, res) {
    console.log('Best client');
    return 1;
  },
};
