const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {Op} = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * Gets all the contracts for a given Client or Contractor
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile, async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const {id: profileId} = req.profile
    const contract = await Contract.findOne({
        where: {
            id,
            [Op.or]: [
                {ContractorId: profileId},
                {ClientId: profileId}
            ]
        }
    })
    if(!contract) return res.status(404).end()
    res.json(contract)
})

// GET /contracts - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.
app.get('/contracts', getProfile, async (req, res) => {
    const {Contract} = req.app.get('models');
    const {id: profileId} = req.profile;
    const contracts = await Contract.findAll({where:
    {
        [Op.or]: [
            {ContractorId: profileId},
            {ClientId: profileId}
        ]
    }})
    return res.json(contracts)
})

module.exports = app;
