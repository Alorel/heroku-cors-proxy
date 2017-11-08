const origOrigin = process.env.ORIGIN_WHITELIST;
const origTarget = process.env.TARGET_WHITELIST;

describe("Extend express", () => {
  describe("res", () => {
    let app;
    
    before(() => {
      app = express();
      
      app.get('/forbid', (req, res) => res.forbid(req.query.msg));
      app.get('/bad-request', (req, res) => res.badRequest(req.query.msg));
      app.get('/error', (req, res) => res.error(req.query.msg));
    });
    
    it('Forbid: no message', done => {
      request(app)
        .get('/forbid')
        .expect(403, '')
        .end(done);
    });
    
    it('Forbid: with message', done => {
      request(app)
        .get('/forbid')
        .query({msg: 'foo'})
        .expect(403, 'foo')
        .end(done);
    });
    
    it('Err: no message', done => {
      request(app)
        .get('/error')
        .expect(500, 'Server error')
        .end(done);
    });
    
    it('Err: with message', done => {
      request(app)
        .get('/error')
        .query({msg: 'foo'})
        .expect(500, 'foo')
        .end(done);
    });
    
    it('Bad request: no message', done => {
      request(app)
        .get('/bad-request')
        .expect(400, '')
        .end(done);
    });
    
    it('Bad request: with message', done => {
      request(app)
        .get('/bad-request')
        .query({msg: 'foo'})
        .expect(400, 'foo')
        .end(done);
    });
  });
  
  describe("req", () => {
    let app;
    
    before(() => {
      process.env.ORIGIN_WHITELIST = 'localhost,127.0.0.1';
      process.env.TARGET_WHITELIST = '127.0.0.1';
      
      delete require.cache[require.resolve('./conf/origin-whitelist')];
      delete require.cache[require.resolve('./filter/origin-whitelist-403')];
      delete require.cache[require.resolve('./conf/target-whitelist')];
      delete require.cache[require.resolve('./filter/target-whitelist-403')];
      delete require.cache[require.resolve('./extend-express')];
      
      app = require('./extend-express')();
      
      app.get('/origin', (req, res) => res.end(req.origin));
      app.get('/origin-hostname', (req, res) => res.end(req.originHostname));
      
      app.get('/target', require('./filter/check-target'));
      app.get('/target', (req, res) => res.end(req.target));
      
      app.get('/hashed-target', require('./filter/check-target'));
      app.get('/hashed-target', (req, res) => res.end(req.hashedTarget));
      
      app.get('/target-hostname', (req, res) => res.end(req.targetHostname));
      app.get('/', (req, res) => res.end(''));
      app.use((err, req, res, next) => {
        if (!err) {
          err = {};
        }
        
        res.status(err.status || 500).end(err.message || err);
      });
    });
    
    after(() => {
      process.env.ORIGIN_WHITELIST = origOrigin;
      process.env.TARGET_WHITELIST = origTarget;
    });
    
    describe("When values are set", () => {
      it('Origin', done => {
        request(app)
          .get('/origin')
          .expect(200, '')
          .end(done);
      });
      
      it('Origin hostname', done => {
        request(app)
          .get('/origin-hostname')
          .expect(200, '')
          .end(done);
      });
      
      it('Target', done => {
        request(app)
          .get('/target')
          .expect(400, 'URL missing. Usage: /?url=http://some-address')
          .end(done);
      });
      
      
      it('Hashed target', done => {
        request(app)
          .get('/hashed-target')
          .expect(400, 'URL missing. Usage: /?url=http://some-address')
          .end(done);
      });
    });
    
    describe("When values aren't set", () => {
      it('Origin', done => {
        request(app)
          .get('/origin')
          .set('Origin', 'https://127.0.0.1')
          .expect(200, 'https://127.0.0.1')
          .end(done);
      });
      
      it('Origin hostname', done => {
        request(app)
          .get('/origin-hostname')
          .set('Origin', 'https://localhosT')
          .expect(200, 'localhost')
          .end(done);
      });
      
      it('Target', done => {
        request(app)
          .get('/target')
          .query({url: 'https://foo.baR'})
          .expect(200, 'https://foo.bar')
          .end(done);
      });
      
      it('Target hostname', done => {
        request(app)
          .get('/target-hostname')
          .query({url: 'http://foo.bar'})
          .expect(200, 'foo.bar')
          .end(done);
      });
      
      it('Hashed target', done => {
        const expect = require('crypto')
          .createHash('md5')
          .update('https://foo.bar')
          .digest('hex');
        
        request(app)
          .get('/hashed-target')
          .query({url: 'https://foo.bar'})
          .expect(200, expect)
          .end(done);
      });
      
    });
  });
});