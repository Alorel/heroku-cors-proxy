describe("method filter", () => {
  let app;
  
  before(() => {
    app = express();
    
    app.use(require('./method'));
    app.get('/', (req, res) => res.end(''));
  });
  
  it('GET', done => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
  
  for (const meth of ['head', 'post', 'put']) {
    it(meth.toUpperCase(), done => {
      let req = request(app);
      
      req = req[meth]('/');
      
      req.expect(405)
        .end(done);
    });
  }
  
});