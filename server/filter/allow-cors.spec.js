describe("allow-cors filter", () => {
  let app;
  
  before(() => {
    app = express();
    
    app.use(require('./allow-cors'));
    app.get('/', (req, res) => res.end(''));
  });
  
  it("Sets header", done => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Access-Control-Allow-Origin', '*')
      .end(done);
  });
});

