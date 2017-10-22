import test from 'ava';
import request from 'supertest';
import express from 'express';

let app;

test.before('Setup', () => {
  app = express();

  app.use(require('../server/filter/allow-cors'));
  app.get('/', (req, res) => res.end(''));
});

test('Sets headers', () => {
  return request(app)
    .get('/')
    .expect('Access-Control-Allow-Origin', '*');
});