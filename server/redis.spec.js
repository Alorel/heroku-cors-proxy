const origRedisCloudUrl = process.env.REDISCLOUD_URL;

describe("Redis", () => {
  before(() => {
    if (!process.env.CACHE_TIME) {
      process.env.CACHE_TIME = '300000';
    }
  });
  
  beforeEach(() => delete require.cache[require.resolve('./redis')]);
  
  describe("Redis without env", () => {
    before(() => process.env.REDISCLOUD_URL = '');
    after(() => process.env.REDISCLOUD_URL = origRedisCloudUrl);
    
    it("Redis without env", () => {
      const msg = 'REDISCLOUD_URL environment variable missing! Please reinstall the button.';
      const fn = () => {
        require('./redis');
      };
      
      expect(fn).to.throw(Error, msg);
    });
  });
  
  (process.env.REDISCLOUD_URL ? describe : describe.skip)("Redis with env", () => {
    let redis;
    
    before(() => redis = require('./redis'));
    
    after(() => {
      if (redis && redis.client) {
        redis.client.quit();
      }
    });
    
    it("Has set function", () => expect(typeof redis.set).to.be("function"));
    it("Has get function", () => expect(typeof redis.get).to.be("function"));
    it("Has shouldCache function", () => expect(typeof redis.shouldCache).to.be("function"));
    it("Has client", () => expect(typeof redis.client).to.be("object"));
    
    describe("shouldCache", () => {
      const allowed = [
        'text/html',
        'test/javascript',
        'test/typescript',
        'application/json',
        'image/svg',
        'text/xml'
      ];
      
      const disallowed = [
        'image/png',
        __filename
      ];
      
      for (const t of allowed) {
        it(`Should allow ${t}`, () => expect(redis.shouldCache(t).to.be(true)));
      }
      
      for (const t of disallowed) {
        it(`Should not allow ${t}`, () => expect(redis.shouldCache(t).to.be(false)));
      }
    });
    
    describe("Get set", () => {
      const randomKey = __filename + Math.random();
      
      const clean = done => {
        redis.client.del(randomKey, () => done());
      };
      
      before(clean);
      after(clean);
      
      describe("Getting a nonexistent value", () => {
        let v;
        
        before(() => {
          v = redis.get(randomKey);
        });
        
        it("Should return a Promise", () => expect(v instanceof Promise).to.equal(true));
        
        it("That resolves to null", done => {
          v.then(v => {
              expect(v).to.equal(null);
              done();
            })
            .catch(done);
        });
      });
      
      describe("Setting a value", () => {
        let v;
        
        before(() => {
          v = redis.set(randomKey, 'text/plain', 'foo');
        });
        
        it("Should return a Promise", () => expect(v instanceof Promise).to.equal(true));
        
        it("That resolves to undefined", done => {
          v.then(v => {
              expect(v).to.equal(undefined);
              done();
            })
            .catch(done);
        })
      });
      
      describe("Getting an existing value", () => {
        let v;
        
        before(done => {
          redis.get(randomKey)
            .then(r => {
              v = r;
              done();
            })
            .catch(done);
        });
        
        it("Should be an object", () => expect(typeof v).to.equal('object'));
        
        it("Should have ctype text/plain", () => expect(v.ctype).to.equal('text/plain'));
        
        it("Should have value foo", () => expect(v.content).to.equal('foo'));
      });
    });
  });
});