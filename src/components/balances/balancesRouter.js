const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const { deposit } = require('./balancesController');

const router = express.Router();

/**
 * POST /balances/deposit/:userId
 * Deposits money into the balance of a client.
 * A client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 */
router.get('/deposit/:userId', getProfile, deposit);

module.exports = {
  balancesRouter: router,
};
