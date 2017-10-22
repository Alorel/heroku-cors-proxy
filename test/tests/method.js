import test from 'ava';
import request from 'supertest';
import express from 'express';

let app;

test.before('Setup', () => {
  app = express();

  app.use(require('../../server/filter/method'));
  app.get('/', (req, res) => res.end(''));
});

test.cb('GET', t => {
  request(app)
    .get('/')
    .expect(200)
    .end(t.end);
});

for (const meth of ['head', 'post', 'put']) {
  test.cb(meth.toUpperCase(), t => {
    let req = request(app);

    req = req[meth]('/');

    req.expect(405)
      .end(t.end);
  });
}
