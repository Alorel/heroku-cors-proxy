const originalWhitelist = process.env.TARGET_WHITELIST;

describe("Target whitelist filter", () => {
  let app;
  
  before(() => {
    process.env.TARGET_WHITELIST = '127.0.0.1';
    delete require.cache[require.resolve('../conf/target-whitelist')];
    delete require.cache[require.resolve('./target-whitelist-403')];
    delete require.cache[require.resolve('../extend-express')];
    
    app = require('../extend-express')();
    app.use(require('./target-whitelist-403'));
    app.get('/', (req, res) => res.end(''));
  });
  
  after(() => process.env.TARGET_WHITELIST = originalWhitelist);
  
  it("Disallowed target", done => {
    request(app)
      .get('/?url=' + encodeURIComponent('https://foo.bar'))
      .expect(403, 'Target domain foo.bar not allowed.')
      .end(done);
  });
  
  it(`Allow 127.0.0.1`, done => {
    request(app)
      .get('/?url=' + encodeURIComponent('https://127.0.0.1'))
      .expect(200, '')
      .end(done);
  });
});