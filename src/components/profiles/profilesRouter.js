const express = require('express');
const { getProfile } = require('../../middleware/getProfile');
const { findAll, findOne } = require('./profilesController');

const router = express.Router();

/**
 * GET /profiles
 * Returns all profiles
 */
router.get('/', getProfile, findAll);

/**
 * GET /profiles/:profileId
 * Returns a single profile
 */
router.get('/:profileId', getProfile, findOne);

module.exports = {
  profilesRouter: router,
};
