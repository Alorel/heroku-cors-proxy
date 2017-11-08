const originalWhitelist = process.env.ORIGIN_WHITELIST;

describe("Origin whitelist", () => {
  const whitelistPath = require.resolve('./origin-whitelist');
  let whitelist;
  
  beforeEach(() => {
    delete require.cache[whitelistPath];
    whitelist = require(whitelistPath);
  });
  
  after(() => process.env.ORIGIN_WHITELIST = originalWhitelist);
  
  describe("No whitelist", () => {
    before(() => process.env.ORIGIN_WHITELIST = '');
    it("Should equal true", () => expect(whitelist).to.equal(true));
  });
  
  describe("Base whitelist", () => {
    before(() => process.env.ORIGIN_WHITELIST = 'localhost,127.0.0.1');
    
    it('Is array', () => expect(Array.isArray(whitelist)).to.equal(true));
    it('Is frozen', () => expect(Object.isFrozen(whitelist)).to.equal(true));
    it('Has localhost', () => expect(whitelist).to.include('localhost'));
    it('Has 127.0.0.1', () => expect(whitelist).to.include('127.0.0.1'));
    it('Has only 2 items', () => expect(whitelist).to.have.lengthOf(2));
  });
});