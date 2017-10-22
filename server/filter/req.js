const defineGetter = require('../define-getter');
const {URL} = require('url');
const crypto = require('crypto');

const getters = [
  [
    'origin',
    function () {
      return this.header('origin') || this.header('referer') || null;
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
      const value = this.query.url;

      if (!value) {
        throw new Error('URL missing. Usage: /?url=http://some-address');
      }

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

module.exports = (req, res, next) => {
  try {
    for (const getter of getters) {
      defineGetter(req, getter[0], getter[1]);
    }

    setImmediate(next);
  } catch (e) {
    res.status(500).end(e.message || e);
  }
};