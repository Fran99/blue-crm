const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { seed } = require('../../scripts/seedDb');
const { Profile, Job } = require('../../src/model');

describe('Integration Tests', () => {
  before(async () => {
    await seed();
  });

  describe('GET /contracts', () => {
    it('Returns an array with one contract', async () => {
      const response = await request(app)
        .get('/contracts')
        .set('profile_id', '1');
      expect(response.body.length).to.equal(1);
    });

    it('Returns an array with two contracts', async () => {
      const response = await request(app)
        .get('/contracts')
        .set('profile_id', '2');

      expect(response.body.length).to.equal(2);
    });
  });

  describe('GET /contracts/:id', () => {
    it('Returns an object with the contract', async () => {
      const response = await request(app)
        .get('/contracts/1')
        .set('profile_id', '1');
      expect(response.body.id).to.equal(1);
    });

    it('Returns 404 since it is not authorized', async () => {
      const response = await request(app)
        .get('/contracts/1')
        .set('profile_id', '2');
      expect(response.statusCode).to.equal(404);
    });
  });

  describe('GET /jobs/unpaid', () => {
    it('Returns an array of unpaid jobs', async () => {
      const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', '2');
      response.body.forEach((job) => {
        expect(job.paid).to.equal(null);
      });
    });
  });

  describe('POST /jobs/:id/pay', async () => {
    let client;
    let contractor;
    let job;
    let client2;
    let contractor2;
    let job2;

    before(async () => {
      [client, contractor, job] = await Promise.all([
        Profile.findOne({ where: { id: 1 } }),
        Profile.findOne({ where: { id: 5 } }),
        Job.findOne({ where: { id: 1 } }),
      ]);

      await request(app)
        .post('/jobs/1/pay')
        .set('profile_id', '1');

      [client2, contractor2, job2] = await Promise.all([
        Profile.findOne({ where: { id: 1 } }),
        Profile.findOne({ where: { id: 5 } }),
        Job.findOne({ where: { id: 1 } }),
      ]);
    });

    it('Should deduct balance from client', () => {
      expect(client2.balance).to.equal(client.balance - job.price);
    });

    it('Should add balance to contractor', () => {
      expect(contractor2.balance).to.equal(contractor.balance + job.price);
    });

    it('Should flag job as paid', () => {
      expect(job.paid).to.equal(null);
    });

    it('Should have a payment date', () => {
      expect(job2.paymentDate).to.not.equal(null);
    });
  });

  describe('POST /balances/deposit/:userId', () => {
    let previousBalance;
    let currentBalance;
    let client;
    const amount = 50;
    before(async () => {
      client = await Profile.findOne({
        where: {
          id: 1,
        },
      });
      previousBalance = client.balance;
      await request(app)
        .post('/balance/deposit/1')
        .send({ amount });

      client = await Profile.findOne({
        where: {
          id: 1,
        },
      });
      currentBalance = client.balance + amount;
    });
    it('Adds the specified amount to the clients balance', () => {
      expect(currentBalance).to.equal(previousBalance + 50);
    });
  });

  describe('GET /admin/best-profession', () => {
    it('Returns an object with the correct profession', async () => {
      const response = await request(app)
        .get('/admin/best-profession');
      expect(response.body.profession).to.equal('Programmer');
    });
  });

  describe('GET /admin/best-clients', () => {
    it('Returns an object with the correct clients', async () => {
      const response = await request(app)
        .get('/admin/best-clients');
      expect(response.body[0].fullname).to.equal('Ash Kethcum');
      expect(response.body[1].fullname).to.equal('Harry Potter');
    });
  });
});
