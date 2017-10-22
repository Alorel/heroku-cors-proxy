const assert = require('assert');

describe('Redis', () => {
  let redis;

  before('Setting up Redis', () => {
    redis = require('../server/redis');
  });

  it('Should have a set function', () => {
    assert.equal(typeof redis.set, 'function');
  });

  it('Should have a get function', () => {
    assert.equal(typeof redis.get, 'function');
  });

  it('Should have a shouldCache function', () => {
    assert.equal(typeof redis.shouldCache, 'function');
  });

  it('Should have a redis client', () => {
    assert.equal(typeof redis.client, 'Object');
  });
});

after('Shutting down redis', () => {
  require('../server/redis').client.quit();
});