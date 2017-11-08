describe("headers filter", () => {
  let app;
  
  const expectations = [
    ['X-Content-Type-Options', 'nosniff'],
    ['Access-Control-Allow-Methods', 'GET, OPTIONS'],
    ['X-Frame-Options', 'deny'],
    ['X-Powered-By', "Trump's tiny cocktail sausage fingers"],
    ['X-source-code', 'https://github.com/Alorel/heroku-cors-proxy']
  ];
  
  before(() => {
    app = express();
    
    app.use(require('./headers'));
    app.get('/', (req, res) => res.end(''));
  });
  
  for (const x of expectations) {
    it(x[0], done => {
      request(app)
        .get('/')
        .expect(200)
        .expect(x[0], x[1])
        .end(done);
    });
  }
});
