const numCPUs = require('os').cpus().length;

require('./redis'); // To validate settings

require('./log').notice(`Starting ${numCPUs} workers...`);

require('throng')(numCPUs, workerID => {
  const Log = require('./log');
  Log.debug(`Starting worker ${workerID}`);

  const app = require('express')();
  app.set('port', process.env.PORT || 5000);

  require('./filter')(app);

  const request = require('request');
  const htmlmin = require('htmlmin');
  const redis = require('./redis');
  const HTMLMIN_OPTIONS = {
    cssmin: true,
    jsmin: true,
    removeComments: true,
    collapseWhitespace: true,
    removeOptionalTags: true
  };

  app.get('/', async (req, res) => {
    try {
      if (!req.target) {
        res.badRequest('URL missing. Usage: /?url=http://some-address');
      } else {
        Log.debug(`Checking if ${req.target} is cached...`);

        let cachedData;

        try {
          cachedData = await redis.get(req.hashedTarget);
        } catch (e) {
          Log.warning('Failed to get cached data', e);
        }

        if (cachedData) {
          Log.info(`${req.target} found in cache.`);
          const {ctype, content} = cachedData;

          res.header('x-cached', '1');
          res.header('content-type', ctype);
          res.end(content);
        } else {
          res.header('x-cached', '0');
          Log.debug(`${req.target} not found in cache. Fetching...`);

          request(req.target, {
            headers: {
              'user-agent': req.header('user-agent') || 'heroku-cors-proxy'
            }
          }, async (e, rsp, body) => {
            if (e) {
              res.error(e);
            } else {
              try {
                const ctype = rsp.headers['content-type'];

                if (ctype.includes('text/html')) {
                  try {
                    body = htmlmin(body, HTMLMIN_OPTIONS);
                  } catch (e) {

                  }
                } else if (ctype.includes('json') && typeof body === 'string') {
                  try {
                    body = JSON.stringify(JSON.parse(body));
                  } catch (e) {

                  }
                }

                if (redis.shouldCache(ctype)) {
                  try {
                    await redis.set(req.hashedTarget, ctype, body);
                  } catch (e) {
                    Log.warning('Failed to set cached data', e);
                  }
                }

                res.header('content-type', ctype);
                res.end(body);
              } catch (e) {
                res.error(e);
              }
            }
          });
        }
      }
    } catch (e) {
      res.error(e);
    }
  });

  app.listen(app.get('port'), () => {
    Log.notice(`Worker ${workerID} listening on port ${app.get('port')}`);
  });
});