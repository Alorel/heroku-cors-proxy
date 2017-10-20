const Log = require('./log');
const whitelist = require('./conf/whitelist');
const shrinkray = require('shrink-ray');
const {URL} = require('url');
const crypto = require('crypto');

const defineGetter = (obj, name, fn) => {
  Object.defineProperty(obj, name, {
    get() {
      const value = fn.call(obj);
      Object.defineProperty(obj, name, {
        value,
        configurable: true,
        enumerable: true
      });

      return value;
    },
    configurable: true,
    enumerable: true
  })
};

const getters = [
  [
    'origin',
    function () {
      return this.header('origin') || this.header('referer');
    }
  ],
  [
    'originHostname',
    function () {
      return this.origin ? new URL(this.origin).hostname : null;
    }
  ],
  [
    'target',
    function () {
      const value = this.params.url;

      // Perform validation - will throw if value is invalid.
      new URL(value);

      return value;
    }
  ],
  [
    'hashedTarget',
    function () {
      return crypto.createHash('md5').update(this.target).digest('hex');
    }
  ]
];

module.exports = app => {
  app.use((req, res, next) => {
    const originalStatus = res.status;
    const originalHeader = res.header;
    const originalEnd = res.end;

    res.end = function () {
      Log.debug('Ending response handling.');
      return originalEnd.apply(this, arguments);
    };

    res.status = function (status) {
      Log.debug(`Set HTTP status to ${status}`);
      return originalStatus.apply(this, arguments);
    };

    res.header = function (k, v) {
      Log.debug(`Set HTTP header "${k}" to ${v}`);
      return originalHeader.apply(this, arguments);
    };

    res.forbid = function (msg) {
      Log.notice(`Responding with 403 forbidden: ${msg}`);

      return this.status(403).end(msg);
    };

    res.badRequest = function (msg) {
      Log.notice(`Responding with 400 bad request: ${msg}`);

      return this.status(400).end(msg);
    };

    res.error = function (err) {
      Log.error('Error processing request.', err);

      return res.status(500).end((err || {}).message || err || 'Server error');
    };

    for (const getter of getters) {
      defineGetter(req, getter[0], getter[1]);
    }

    setImmediate(next);
  });

  app.use(shrinkray({
    threshold: 1,
    zlib: {
      level: 9
    },
    brotli: {
      quality: 11
    }
  }));

  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('X-Frame-Options', 'deny');
    res.header('X-Powered-By', "Trump's tiny cocktail sausage fingers");
    res.header('X-source-code', 'https://github.com/Alorel/heroku-cors-proxy');
    setImmediate(next);
  });

  const PATH = '/:url';

  app.use(PATH, (req, res, next) => {
    const meth = req.method.toLowerCase();

    if (meth !== 'get' && meth !== 'options') {
      res.status(405).end();
    } else {
      setImmediate(next);
    }
  });

  app.use(PATH, (req, res, next) => {
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
    app.use(PATH, (req, res, next) => {
      if (!whitelist.includes(req.originHostname)) {
        res.forbid(`Origin ${req.originHostname} not allowed`);
      } else {

        Log.info(`Origin filter passed for origin ${req.originHostname}`);
        setImmediate(next);
      }
    });
  }

  app.use(PATH, (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    setImmediate(next);
  });
};