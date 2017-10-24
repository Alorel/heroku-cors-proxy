import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.use(require('../../server/filter/target-whitelist-403'));
  app.get('/', (req, res) => res.end(''));
});

test.cb('Disallowed target', t => {
  request(app)
    .get('/?url=' + encodeURIComponent('https://foo.bar'))
    .expect(403, 'Target domain foo.bar not allowed.')
    .end(t.end);
});

for (const allow of require('../../server/conf/target-whitelist')) {
  test.cb(`Allow ${allow}`, t => {
    request(app)
      .get(`/?url=${encodeURIComponent(`https://${allow}?some-query-string=1`)}`)
      .expect(200, '')
      .end(t.end);
  });
}
