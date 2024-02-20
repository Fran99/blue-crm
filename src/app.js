const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const helmet = require('helmet');
const cors = require('cors');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { contractsRouter } = require('./components/contracts/contractsRouter');
const { jobsRouter } = require('./components/jobs/jobsRouter');
const { balancesRouter } = require('./components/balances/balancesRouter');

const app = express();
app.use(bodyParser.json(), helmet(), cors());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contractsRouter);
app.use('/jobs', jobsRouter);
app.use('/balances', balancesRouter);

// GET /admin/best-profession?start=<date>&end=<date> - Returns the profession that earned the most money
// (sum of jobs paid) for any contactor that worked in the query time range.
app.get('/admin/best-profession', async (req, res) => {

});

app.get('/admin/profiles', async (req, res) => {
  const { Profile } = req.app.get('models');
  const profiles = await Profile.findAll();

  return res.json({
    data: profiles,
  });
});

app.get('/admin/profiles/:profileId', async (req, res) => {
  const { Profile } = req.app.get('models');
  const profile = await Profile.findOne({
    where: {
      id: +req.params.profileId,
    },
  });

  if (!profile) {
    return res.status(404).end();
  }

  return res.json({
    data: profile,
  });
});

module.exports = app;
