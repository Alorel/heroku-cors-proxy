const Log = require('../log');

module.exports = (req, res, next) => {
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

  setImmediate(next);
};