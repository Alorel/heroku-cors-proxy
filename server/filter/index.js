const originWhitelist = require('../conf/origin-whitelist');
const targetWhitelist = require('../conf/target-whitelist');
const shrinkray = require('shrink-ray');

const SHRINKRAY_CONF = {
  threshold: 1,
  zlib: {
    level: 9
  },
  brotli: {
    quality: 11
  }
};

module.exports = app => {
  app.use(shrinkray(SHRINKRAY_CONF));
  app.use(require('./headers'));
  app.use(require('./method'));

  app.get('/ping', require('./pingpong'));
  app.use('/', require('./check-origin'));

  if (originWhitelist !== true) {
    app.use('/', require('./origin-whitelist-403'));
  }

  if (targetWhitelist !== true) {
    app.use('/', require('./target-whitelist-403'));
  }

  app.use(require('./allow-cors'));
};