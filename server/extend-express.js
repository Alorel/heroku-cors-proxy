const req = require('express/lib/request');
const res = require('express/lib/request');
const Log = require('./log');
const {URL} = require('url');
const crypto = require('crypto');

const originalStatus = res.status;
const originalHeader = res.header;
const originalEnd = res.end;

res.end = function() {
  Log.debug('Ending response handling.');
  return originalEnd.apply(this, arguments);
};

res.status = function(status) {
  Log.debug(`Set HTTP status to ${status}`);
  return originalStatus.apply(this, arguments);
};

res.header = function(k, v) {
  Log.debug(`Set HTTP header "${k}" to ${v}`);
  return originalHeader.apply(this, arguments);
};

res.forbid = function(msg) {
  Log.notice(`Responding with 403 forbidden: ${msg}`);

  return this.status(403).end(msg);
};

res.badRequest = function(msg) {
  Log.notice(`Responding with 400 bad request: ${msg}`);

  return this.status(400).end(msg);
};

res.error = function(err) {
  Log.error('Error processing request.', err);

  return res.status(500).end((err || {}).message || err || 'Server error');
};

Object.defineProperties(req, {
  origin: {
    get() {
      let value = this.header('origin') || this.header('referer');

      if (value) {
        value = value.toLowerCase();
      }

      Object.defineProperty(this, 'origin', {value});
      return value;
    }
  },
  originHostname: {
    get() {
      const value = this.origin ? new URL(this.origin).hostname : null;

      Object.defineProperty(this, 'originHostname', {value});

      return value;
    }
  },
  target: {
    get() {
      let value = this.params.url;

      // Perform validation - will throw if value is invalid.
      new URL(value);

      Object.defineProperty(this, 'target', {value});

      return value;
    }
  },
  hashedTarget: {
    get() {
      const value = crypto.createHash('md5').update(this.target).digest('hex');
      Object.defineProperty(this, 'hashedTarget', {value});
      return value;
    }
  }
});