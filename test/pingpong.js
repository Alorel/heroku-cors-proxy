import test from 'ava';
import request from 'supertest';
import express from 'express';

let app;

test.before('Setup', () => {
  app = express();

  app.get('/', require('../server/filter/pingpong'));
});

test.cb('PingPong', t => {
  request(app)
    .get('/')
    .expect(200, 'pong')
    .end(t.end);
});
