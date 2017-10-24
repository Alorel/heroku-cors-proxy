import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.get('/', require('../../server/filter/pingpong'));
});

test.cb('PingPong', t => {
  request(app)
    .get('/')
    .expect(200, 'pong')
    .end(t.end);
});
