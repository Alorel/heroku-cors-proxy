import test from 'ava';
import request from 'supertest';
import express from 'express';

let app;

const expectations = [
  ['X-Content-Type-Options', 'nosniff'],
  ['Access-Control-Allow-Methods', 'GET, OPTIONS'],
  ['X-Frame-Options', 'deny'],
  ['X-Powered-By', "Trump's tiny cocktail sausage fingers"],
  ['X-source-code', 'https://github.com/Alorel/heroku-cors-proxy']
];

test.before('Setup', () => {
  app = express();

  app.use(require('../../server/filter/headers'));
  app.get('/', (req, res) => res.end(''));
});

for (const x of expectations) {
  test.cb(x[0], t => {
    request(app)
      .get('/')
      .expect(200)
      .expect(x[0], x[1])
      .end(t.end);
  });
}
