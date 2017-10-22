import test from 'ava';

let whitelist;

test.before('Set up whitelist', () => {
  whitelist = require('../server/conf/whitelist');
});

test('Whitelist', t => {
  t.is(whitelist, ['localhost', '127.0.0.1'], 'Whitelist should be localhost');
});