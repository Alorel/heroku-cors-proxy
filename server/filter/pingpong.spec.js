describe("Ping pong", () => {
  let app;
  
  before(() => {
    app = express();
    app.get('/', require('./pingpong'));
  });
  
  it('Should echo "pong"', done => {
    request(app)
      .get('/')
      .expect(200, 'pong')
      .end(done);
  });
});

