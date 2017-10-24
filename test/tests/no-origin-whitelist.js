import test from 'ava';

let whitelist;

test.before('Setting up whitelist', () => {
  process.env.ORIGIN_WHITELIST = '';
  whitelist = require('../../server/conf/origin-whitelist');
});

test('No whitelist', t => {
  t.true(whitelist, 'Whitelist should be true');
});