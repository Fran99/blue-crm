const express = require('express');
const { findAll, findOne } = require('./profilesController');

const router = express.Router();

/**
 * GET /profiles
 * Returns all profiles
 */
router.get('/', findAll);

/**
 * GET /profiles/:profileId
 * Returns a single profile
 */
router.get('/:profileId', findOne);

module.exports = {
  profilesRouter: router,
};
