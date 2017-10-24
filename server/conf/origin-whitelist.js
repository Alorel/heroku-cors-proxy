let originWhitelist;

if (process.env.ORIGIN_WHITELIST) {
  originWhitelist = Object.freeze(process.env.ORIGIN_WHITELIST.toLowerCase().split(/\s*,\s*/));
  const Log = require('../log');

  Log.debug('CORS requests will be permitted from the following origins:');
  for (const origin of originWhitelist) {
    Log.debug(`\t${origin}`);
  }
} else {
  process.emitWarning('The ORIGIN_WHITELIST env variable is not set.', {
    code: 'SETUP_WARNING',
    detail: 'Requests will be allowed from all origins.'
  });
  originWhitelist = true;
}

module.exports = originWhitelist;