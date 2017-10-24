import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.use(require('../../server/filter/whitelist-403'));
  app.get('/', (req, res) => res.end(''));
});

test.cb('Disallowed origin', t => {
  request(app)
    .get('/')
    .set('Origin', 'https://foo.bar')
    .expect(403, 'Origin foo.bar not allowed')
    .end(t.end);
});

for (const allow of require('../../server/conf/whitelist')) {
  test.cb(`Allow ${allow}`, t => {
    request(app)
      .get('/')
      .set('Origin', `https://${allow}`)
      .expect(200, '')
      .end(t.end);
  });
}
