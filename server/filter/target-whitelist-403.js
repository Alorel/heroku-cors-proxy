const whitelist = require('../conf/target-whitelist');
const Log = require('../log');

module.exports = (req, res, next) => {
  if (!whitelist.includes(req.targetHostname)) {
    res.forbid(`Target domain ${req.targetHostname} not allowed.`);
  } else {
    Log.info(`Target filter passed for domain ${req.targetHostname}`);
    setImmediate(next);
  }
};