import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.use(require('../../server/filter/check-target'));
  app.use(require('../../server/filter/check-origin'));
  require('../util/full-req-handler')(app);
});

test.cb('Origin', t => {
  request(app)
    .get('/origin')
    .expect(200, '')
    .end(t.end);
});

test.cb('Origin hostname', t => {
  request(app)
    .get('/origin-hostname')
    .expect(200, '')
    .end(t.end);
});

test.cb('Target', t => {
  request(app)
    .get('/target')
    .expect(400, 'URL missing. Usage: /?url=http://some-address')
    .end(t.end);
});


test.cb('Hashed target', t => {
  request(app)
    .get('/hashed-target')
    .expect(400, 'URL missing. Usage: /?url=http://some-address')
    .end(t.end);
});


