import test from 'ava';

test.before(() => {
  console.log('before');
});

test.beforeEach(() => {
  console.log('Before each');
});

test.after(() => {
  console.log('after 1');
});

test.after(() => {
  console.log('after 2');
});

test.afterEach(() => {
  console.log('after each');
});

test('Tmp test', t => {

  t.true(true);
  t.false(false);
});