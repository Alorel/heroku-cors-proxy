const numCPUs = require('os').cpus().length;

require('./redis').client.quit(); // To validate settings

require('./log').notice(`Starting ${numCPUs} workers...`);

require('throng')(numCPUs, workerID => {
  const Log = require('./log');
  Log.debug(`Starting worker ${workerID}`);

  const app = require('./app');

  app.listen(app.get('port'), () => {
    Log.notice(`Worker ${workerID} listening on port ${app.get('port')}`);
  });
});