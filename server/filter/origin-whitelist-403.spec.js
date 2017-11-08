const originalWhitelist = process.env.ORIGIN_WHITELIST;

describe("Origin whitelist filter", () => {
  let app;
  
  before(() => {
    process.env.ORIGIN_WHITELIST = '127.0.0.1,localhost';
    delete require.cache[require.resolve('../conf/origin-whitelist')];
    delete require.cache[require.resolve('./origin-whitelist-403')];
    delete require.cache[require.resolve('../extend-express')];
    
    app = require('../extend-express')();
    app.use(require('./origin-whitelist-403'));
    app.get('/', (req, res) => res.end(''));
  });
  
  after(() => process.env.ORIGIN_WHITELIST = originalWhitelist);
  
  it("Disallowed origin", done => {
    request(app)
      .get('/')
      .set('Origin', 'https://foo.bar')
      .expect(403, 'Origin foo.bar not allowed')
      .end(done);
  });
  
  for (const allow of ['127.0.0.1', 'localhost']) {
    it(`Allow ${allow}`, done => {
      request(app)
        .get('/')
        .set('Origin', `https://${allow}`)
        .expect(200, '')
        .end(done);
    });
  }
});