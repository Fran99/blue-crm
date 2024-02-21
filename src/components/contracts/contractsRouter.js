const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const { findAll, findOne } = require('./contractsController');

const router = express.Router();

/**
 * GET /contracts
 * Returns a list of contracts belonging to a user (client or contractor).
 * The list should only contain non terminated contracts.
 */
router.get('/', getProfile, findAll);

/**
 * GET /contracts/:id
 * Gets all the contracts for a given Client or Contractor
 */
router.get('/:id', getProfile, findOne);

module.exports = {
  contractsRouter: router,
};
