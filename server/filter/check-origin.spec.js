describe("check-origin filter", () => {
  let app;
  
  before(() => {
    app = express();
    
    app.use(require('./check-origin'));
    app.get('/origin', (req, res) => res.end(req.origin));
    app.get('/origin-hostname', (req, res) => res.end(req.originHostname));
  });
  
  it('No origin', done => {
    request(app)
      .get('/')
      .expect(400, 'Could not determine origin')
      .end(done);
  });
  
  it('Origin: empty string', done => {
    request(app)
      .get('/')
      .set('Origin', '')
      .expect(400, 'Could not determine origin')
      .end(done);
  });
  
  it('Origin: set', done => {
    request(app)
      .get('/origin')
      .set('Origin', 'https://127.0.0.1')
      .expect(200, 'https://127.0.0.1')
      .end(done);
  });
  
  it('OriginHostname: set', done => {
    request(app)
      .get('/origin-hostname')
      .set('Origin', 'https://127.0.0.1')
      .expect(200, '127.0.0.1')
      .end(done);
  });
});