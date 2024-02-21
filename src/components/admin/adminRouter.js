const express = require('express');
const { bestProfession, bestClients } = require('./adminController');

const router = express.Router();

/**
 * GET /admin/best-profession?start=<date>&end=<date>
 * Returns the profession that earned the most money
 * (sum of jobs paid) for any contactor that worked in the query time range.
 */
router.get('/best-profession', bestProfession);

/**
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>
 * Returns the clients the paid the most for jobs in the query time period.
 * Limit query parameter should be applied, default limit is 2.
 */
router.get('/best-clients', bestClients);

module.exports = {
  adminRouter: router,
};
