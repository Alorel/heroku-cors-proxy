import test from 'ava';

test('Redis without env', t => {
  console.log(Object.keys(t).sort());
  t.throws(
    () => {
      require('../server/redis');
    },
    'REDISCLOUD_URL environment variable missing! Please reinstall the button.'
  );
});