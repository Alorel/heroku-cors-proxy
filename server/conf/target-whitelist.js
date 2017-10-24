const Log = require('../log');
let targetWhitelist;

if (process.env.TARGET_WHITELIST) {
  targetWhitelist = Object.freeze(process.env.TARGET_WHITELIST.toLowerCase().split(/\s*,\s*/));
  const Log = require('../log');

  Log.info('CORS requests will be permitted to the following domains:');
  for (const origin of targetWhitelist) {
    Log.info(`\t${origin}`);
  }
} else {
  Log.notice('The TARGET_WHITELIST env variable is not set. Requests will be allowed to all domains!');
  targetWhitelist = true;
}

module.exports = targetWhitelist;