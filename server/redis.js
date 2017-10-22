const Log = require('./log');

let CACHE_TIME = 0;

if (process.env.CACHE_TIME) {
  CACHE_TIME = parseInt(process.env.CACHE_TIME);

  if (!isNaN(CACHE_TIME) && CACHE_TIME < 0) {
    CACHE_TIME = 0;
  }
}

let get, set, shouldCache, client;

if (!CACHE_TIME) {
  Log.warning('Cache disabled.');
  get = () => Promise.resolve();
  set = get;
  shouldCache = () => false;
  client = null;
} else if (!process.env.REDISCLOUD_URL) {
  throw new Error('REDISCLOUD_URL environment variable missing! Please reinstall the button.');
} else {
  client = require('redis').createClient(process.env.REDISCLOUD_URL);

  const cacheableCtypeSubstrings = [
    'text',
    'javascript',
    'typescript',
    'json',
    'svg',
    'xml',
    'html'
  ];

  get = key => new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve(JSON.parse(data));
      } else {
        resolve(null);
      }
    });
  });

  set = (key, ctype, content) => new Promise((resolve, reject) => {
    const set = JSON.stringify({ctype, content});

    client.psetex(key, CACHE_TIME, set, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  });

  shouldCache = ctype => {
    ctype = ctype.toLowerCase();

    for (const sub of cacheableCtypeSubstrings) {
      if (ctype.includes(sub)) {
        return true;
      }
    }

    return false;
  };
}

module.exports = {get, set, shouldCache, client};
