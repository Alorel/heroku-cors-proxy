import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.get('/forbid', (req, res) => res.forbid(req.query.msg));
  app.get('/bad-request', (req, res) => res.badRequest(req.query.msg));
  app.get('/error', (req, res) => res.error(req.query.msg));
});

test.cb('Forbid: no message', t => {
  request(app)
    .get('/forbid')
    .expect(403, '')
    .end(t.end);
});

test.cb('Forbid: with message', t => {
  request(app)
    .get('/forbid')
    .query({msg: 'foo'})
    .expect(403, 'foo')
    .end(t.end);
});

test.cb('Err: no message', t => {
  request(app)
    .get('/error')
    .expect(500, 'Server error')
    .end(t.end);
});

test.cb('Err: with message', t => {
  request(app)
    .get('/error')
    .query({msg: 'foo'})
    .expect(500, 'foo')
    .end(t.end);
});

test.cb('Bad request: no message', t => {
  request(app)
    .get('/bad-request')
    .expect(400, '')
    .end(t.end);
});

test.cb('Bad request: with message', t => {
  request(app)
    .get('/bad-request')
    .query({msg: 'foo'})
    .expect(400, 'foo')
    .end(t.end);
});