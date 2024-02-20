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
    it('Returns and array with one contract', () => request(app)
      .get('/contracts')
      .set('profile_id', '1')
      .then((response) => {
        expect(response.body[0].id).to.equal(2);
      }));
  });
});
