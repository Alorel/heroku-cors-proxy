import test from 'ava';

let redis;

test.before('Setting up Redis', () => {
  redis = require('../server/redis');
});

test.after.always('Stopping Redis', () => {
  if (redis && redis.client) {
    redis.client.quit();
  }
});

test('Redis', t => {
  t.is(typeof redis.set, 'function', 'Has set function');
  t.is(typeof redis.get, 'function', 'Has get function');
  t.is(typeof redis.shouldCache, 'function', 'Has shouldCache function');
  t.is(typeof redis.client, 'object', 'Has client');
});