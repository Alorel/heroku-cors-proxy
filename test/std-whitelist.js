import test from 'ava';

let whitelist;

test.before('Set up whitelist', () => {
  whitelist = require('../server/conf/whitelist');
});

test('Whitelist', t => {
  const wlist = JSON.stringify(whitelist);
  const expect = JSON.stringify(['localhost', '127.0.0.1']);

  t.is(wlist, expect, 'Whitelist should be localhost');
});