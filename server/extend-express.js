const express = require('express');
const {URL} = require('url');
const crypto = require('crypto');
const Log = require('./log');

Object.defineProperties(express.request, {
  origin: {
    configurable: true,
    get() {
      const value = this.header('origin') || this.header('referer') || null;
      Object.defineProperty(this, 'origin', {value});
      return value;
    }
  },
  originHostname: {
    configurable: true,
    get() {
      const value = this.origin ? new URL(this.origin).hostname : null;
      Object.defineProperty(this, 'originHostname', {value});
      return value;
    }
  },
  target: {
    configurable: true,
    get() {
      let value = this.query.url;

      if (!value) {
        throw new Error('URL missing. Usage: /?url=http://some-address');
      } else {
        value = value.trim().toLowerCase();
      }

      // Perform validation - will throw if value is invalid.
      new URL(value);

      Object.defineProperty(this, 'target', {value});
      return value;
    }
  },
  hashedTarget: {
    configurable: true,
    get() {
      const value = crypto.createHash('md5').update(this.target).digest('hex');
      Object.defineProperty(this, 'hashedTarget', {value});
      return value;
    }
  }
});

const originalStatus = express.response.status;
const originalHeader = express.response.header;
const originalEnd = express.response.end;

express.response.end = function () {
  Log.debug('Ending response handling.');
  return originalEnd.apply(this, arguments);
};

express.response.status = function (status) {
  Log.debug(`Set HTTP status to ${status}`);
  return originalStatus.apply(this, arguments);
};

express.response.header = function (k, v) {
  Log.debug(`Set HTTP header "${k}" to ${v}`);
  return originalHeader.apply(this, arguments);
};

express.response.forbid = function (msg) {
  Log.notice(`Responding with 403 forbidden: ${msg}`);

  return this.status(403).end(msg);
};

express.response.badRequest = function (msg) {
  Log.notice(`Responding with 400 bad request: ${msg}`);

  return this.status(400).end(msg);
};

express.response.error = function (err) {
  Log.error('Error processing request.', err);

  return this.status(500).end((err || {}).message || err || 'Server error');
};

module.exports = express;