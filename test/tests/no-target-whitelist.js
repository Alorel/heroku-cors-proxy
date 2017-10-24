import test from 'ava';

let whitelist;

test.before('Setting up', () => {
  process.env.TARGET_WHITELIST = '';
  whitelist = require('../../server/conf/target-whitelist');
});

test('No whitelist', t => {
  t.true(whitelist, 'Whitelist should be true');
});
