module.exports = app => {
  app.get('/origin', (req, res) => res.end(req.origin));
  app.get('/origin-hostname', (req, res) => res.end(req.originHostname));
  app.get('/target', (req, res) => res.end(req.target));
  app.get('/hashed-target', (req, res) => res.end(req.hashedTarget));
  app.get('/', (req, res) => res.end(''));

  app.use((err, req, res, next) => {
    res.status(500).end(err.message || err);
  });
};