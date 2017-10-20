const winston = require('winston');

let Log = {};

winston.setLevels(winston.config.syslog.levels);
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  colorize: false,
  level: (() => {
    const levels = ['emerg', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug'];

    for (const level of levels) {
      Log[level] = (message, ...placeholders) => {
        winston.log(level, message, ...placeholders);
      };
    }

    let desiredLogLevel = (process.env.LOG_LEVEL || '').toLowerCase() || 'debug';

    if (!levels.includes(desiredLogLevel)) {
      process.emitWarning(`Invalid log level: ${desiredLogLevel}`, {
        code: 'SETUP_WARNING',
        detail: `Permitted log levels are: ${levels.join(', ')}. The application will log at debug level now.`
      });
    }
  })()
});

Log = Object.freeze(Log);
module.exports = Log;