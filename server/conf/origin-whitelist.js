const Log = require('../log');
let originWhitelist;

if (process.env.ORIGIN_WHITELIST) {
  originWhitelist = Object.freeze(process.env.ORIGIN_WHITELIST.toLowerCase().split(/\s*,\s*/));
  const Log = require('../log');

  Log.info('CORS requests will be permitted from the following origins:');
  for (const origin of originWhitelist) {
    Log.info(`\t${origin}`);
  }
} else {
  Log.warning('The ORIGIN_WHITELIST env variable is not set. Requests will be allowed from all origins!');
  originWhitelist = true;
}

module.exports = originWhitelist;