import test from 'ava';

let whitelist;

test.before('Set up whitelist', () => {
  whitelist = require('../../server/conf/whitelist');
});

test('Is array', t => t.true(Array.isArray(whitelist)));
test('Is frozen', t => t.true(Object.isFrozen(whitelist)));
test('Has localhost', t => t.true(whitelist.includes('localhost')));
test('Has 127.0.0.1', t => t.true(whitelist.includes('127.0.0.1')));
test('Has only 2 items', t => t.is(whitelist.length, 2));
