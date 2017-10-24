import test from 'ava';
import request from 'supertest';

let app;

test.before('Setup', () => {
  app = require('../../server/extend-express')();

  app.use(require('../../server/filter/check-target'));
  app.get('/target', (req, res) => res.end(req.target));
  app.get('/target-hostname', (req, res) => res.end(req.targetHostname));
});

test.cb('No target', t => {
  request(app)
    .get('/')
    .expect(400, 'URL missing. Usage: /?url=http://some-address')
    .end(t.end);
});

test.cb('Target = empty string', t => {
  request(app)
    .get('/?url=')
    .expect(400, 'URL missing. Usage: /?url=http://some-address')
    .end(t.end);
});

test.cb('Target: localHost', t => {
  request(app)
    .get(`/target?url=${encodeURIComponent('https://localHost')}`)
    .expect(200, 'https://localhost')
    .end(t.end);
});

test.cb('Target: foo.com', t => {
  request(app)
    .get(`/target?url=${encodeURIComponent('http://foo.com')}`)
    .expect(200, 'http://foo.com')
    .end(t.end);
});

test.cb('TargetHostname', t => {
  request(app)
    .get(`/target-hostname?url=${encodeURIComponent('http://foo.coM')}`)
    .expect(200, 'foo.com')
    .end(t.end);
});