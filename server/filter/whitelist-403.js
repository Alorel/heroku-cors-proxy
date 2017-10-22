const whitelist = require('../conf/whitelist');

module.exports = (req, res, next) => {
  if (!whitelist.includes(req.originHostname)) {
    res.forbid(`Origin ${req.originHostname} not allowed`);
  } else {

    Log.info(`Origin filter passed for origin ${req.originHostname}`);
    setImmediate(next);
  }
};