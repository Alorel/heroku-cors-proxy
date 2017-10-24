import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  require('../util/full-req-handler')(app);
});

test.cb('Origin', t => {
  request(app)
    .get('/origin')
    .set('Origin', 'https://127.0.0.1')
    .expect(200, 'https://127.0.0.1')
    .end(t.end);
});

test.cb('Origin hostname', t => {
  request(app)
    .get('/origin-hostname')
    .set('Origin', 'https://127.0.0.1')
    .expect(200, '127.0.0.1')
    .end(t.end);
});

test.cb('Target', t => {
  request(app)
    .get('/target')
    .query({url: 'https://foo.bar'})
    .expect(200, 'https://foo.bar')
    .end(t.end);
});


test.cb('Hashed target', t => {
  const expect = require('crypto')
    .createHash('md5')
    .update('https://foo.bar')
    .digest('hex');

  request(app)
    .get('/hashed-target')
    .query({url: 'https://foo.bar'})
    .expect(200, expect)
    .end(t.end);
});


