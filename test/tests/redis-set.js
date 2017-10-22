import test from 'ava';

let redis;

test.before('Setting up Redis', () => {
  redis = require('../../server/redis');
});

test.after.always('Stopping Redis', () => {
  if (redis && redis.client) {
    redis.client.quit();
  }
});

test('Has set function', t => t.is(typeof redis.set, 'function'));
test('Has get function', t => t.is(typeof redis.get, 'function'));
test('Has shouldCache function', t => t.is(typeof redis.shouldCache, 'function'));
test('Has client', t => t.is(typeof redis.client, 'object'));