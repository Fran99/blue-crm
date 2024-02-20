const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const { seed } = require('../../scripts/seedDb');

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
});
