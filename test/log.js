import test from 'ava';

let Log;

test.before('Set up log', () => {
  Log = require('../server/log');
});

test('Has levels', t => {
  const levels = ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'];

  for (const level of levels) {
    t.true(level in Log, `Has level ${level}`);
  }
});

test('Is frozen', t => t.true(Object.isFrozen(Log)));