import test from 'ava';

let Log;

test.before('Set up log', () => {
  Log = require('../../server/log');
});

test('Is frozen', t => t.true(Object.isFrozen(Log)));

const levels = ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'];

for (const level of levels) {
  test(`Has level ${level}`, t => t.true(level in Log));
}

