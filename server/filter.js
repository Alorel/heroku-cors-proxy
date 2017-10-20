const Log = require('./log');
const whitelist = require('./conf/whitelist');
const shrinkray = require('shrink-ray');

module.exports = app => {
  app.all('*', shrinkray({
    threshold: 1,
    zlib: {
      level: 9
    },
    brotli: {
      quality: 11
    }
  }));

  app.all('*', (req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('X-Frame-Options', 'deny');
    res.header('X-Powered-By', "Trump's tiny cocktail sausage fingers");
    res.header('X-source-code', 'https://github.com/Alorel/heroku-cors-proxy');
    setImmediate(next);
  });

  const PATH = '/:url';

  app.all(PATH, (req, res, next) => {
    const meth = req.method.toLowerCase();

    if (meth !== 'get' && meth !== 'options') {
      res.status(405).end();
    } else {
      setImmediate(next);
    }
  });

  app.all(PATH, (req, res, next) => {
    try {
      if (!req.origin) {
        res.badRequest('Could not determine origin');
      } else if (!req.originHostname) {
        res.badRequest('Failed to parse origin');
      } else if (!req.target) {
        res.badRequest('Target missing');
      } else {
        setImmediate(next);
      }
    } catch (e) {
      res.error(e);
    }
  });

  if (whitelist !== true) {
    app.all(PATH, (req, res, next) => {
      if (!whitelist.includes(req.originHostname)) {
        res.forbid(`Origin ${req.originHostname} not allowed`);
      } else {

        Log.info(`Origin filter passed for origin ${req.originHostname}`);
        setImmediate(next);
      }
    });
  }

  app.all(PATH, (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    setImmediate(next);
  });
};