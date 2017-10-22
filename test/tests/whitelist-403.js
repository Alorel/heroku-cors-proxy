import test from 'ava';
import request from 'supertest';
import express from 'express';

let app;
let req;

test.before('Setup', () => {
  app = express();

  app.use(require('../../server/filter/req'));
  app.use(require('../../server/filter/res'));
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

for (const allow of ['127.0.0.1', 'localhost']) {
  test.cb(`Allow ${allow}`, t => {
    request(app)
      .get('/')
      .set('Origin', `https://${allow}`)
      .expect(200, '')
      .end(t.end);
  });
}
