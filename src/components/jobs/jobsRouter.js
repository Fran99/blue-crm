const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const { unpaid, pay } = require('./jobsController');

const router = express.Router();

/**
 * GET /jobs/unpaid
 * Returns all unpaid jobs for a user (either a client or contractor),
 * for active contracts only.
 * Contracts are considered active only when status is in_progress
 */
router.get('/deposit/:userId', getProfile, unpaid);

/**
 * POST /jobs/:job_id/pay
 * Pay for a job, a client can only pay if his balance >= the amount to pay
 * The amount should be moved from the client's balance to the contractor balance.
 */
router.post('/:jobId/pay', getProfile, pay);

module.exports = {
  jobsRouter: router,
};
