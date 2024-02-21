const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { sequelize } = require('./model');
const { contractsRouter } = require('./components/contracts/contractsRouter');
const { jobsRouter } = require('./components/jobs/jobsRouter');
const { balancesRouter } = require('./components/balances/balancesRouter');
const { profilesRouter } = require('./components/profiles/profilesRouter');
const { adminRouter } = require('./components/admin/adminRouter');

const app = express();
app.use(bodyParser.json(), helmet(), cors());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contractsRouter);
app.use('/jobs', jobsRouter);
app.use('/balances', balancesRouter);
app.use('/profiles', profilesRouter);
app.use('/admin', adminRouter);

module.exports = app;
