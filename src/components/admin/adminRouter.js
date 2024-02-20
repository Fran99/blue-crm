const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const { bestProfession, bestClient } = require('./adminController');

const router = express.Router();

/**
 * GET /admin/best-profession?start=<date>&end=<date>
 * Returns the profession that earned the most money
 * (sum of jobs paid) for any contactor that worked in the query time range.
 */
router.get('/best-profession', getProfile, bestProfession);

/**
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>
 * Returns the clients the paid the most for jobs in the query time period.
 * Limit query parameter should be applied, default limit is 2.
 */
router.get('/best-clients', getProfile, bestClient);

module.exports = {
  adminRouter: router,
};
