import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.use(require('../../server/filter/allow-cors'));
  app.get('/', (req, res) => res.end(''));
});

test.cb('Sets header', t => {
  request(app)
    .get('/')
    .expect(200)
    .expect('Access-Control-Allow-Origin', '*')
    .end(t.end);
});