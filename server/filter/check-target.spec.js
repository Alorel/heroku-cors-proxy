describe("check-target filter", () => {
  let app;
  
  before(() => {
    app = express();
    app = require('../extend-express')();
    
    app.use(require('./check-target'));
    app.get('/target', (req, res) => res.end(req.target));
    app.get('/target-hostname', (req, res) => res.end(req.targetHostname));
  });
  
  it('No target', done => {
    request(app)
      .get('/')
      .expect(400, 'URL missing. Usage: /?url=http://some-address')
      .end(done);
  });
  
  it('Target = empty string', done => {
    request(app)
      .get('/?url=')
      .expect(400, 'URL missing. Usage: /?url=http://some-address')
      .end(done);
  });
  
  it('Target: localHost', done => {
    request(app)
      .get(`/target?url=${encodeURIComponent('https://localHost')}`)
      .expect(200, 'https://localhost')
      .end(done);
  });
  
  it('Target: foo.com', done => {
    request(app)
      .get(`/target?url=${encodeURIComponent('http://foo.com')}`)
      .expect(200, 'http://foo.com')
      .end(done);
  });
  
  it('TargetHostname', done => {
    request(app)
      .get(`/target-hostname?url=${encodeURIComponent('http://foo.coM')}`)
      .expect(200, 'foo.com')
      .end(done);
  });
});