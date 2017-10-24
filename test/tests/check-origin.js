import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.use(require('../../server/filter/check-origin'));
  app.get('/origin', (req, res) => res.end(req.origin));
  app.get('/origin-hostname', (req, res) => res.end(req.originHostname));
});

test.cb('No origin', t => {
  request(app)
    .get('/')
    .expect(400, 'Could not determine origin')
    .end(t.end);
});

test.cb('Origin: set', t => {
  request(app)
    .get('/origin')
    .set('Origin', 'https://127.0.0.1')
    .expect(200, 'https://127.0.0.1')
    .end(t.end);
});

test.cb('OriginHostname: set', t => {
  request(app)
    .get('/origin-hostname')
    .set('Origin', 'https://127.0.0.1')
    .expect(200, '127.0.0.1')
    .end(t.end);
});