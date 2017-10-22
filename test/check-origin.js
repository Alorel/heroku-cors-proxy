import test from 'ava';
import request from 'supertest';
import express from 'express';

let app;

test.before('Setup', () => {
  app = express();

  require('../server/filter')(app);
  app.get('/', (req, res) => res.end(''));
});

test.cb('No origin', t => {
  request(app)
    .get('/')
    .expect(400, 'Could not determine origin')
    .end(t.end);
});