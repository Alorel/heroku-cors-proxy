const originalWhitelist = process.env.TARGET_WHITELIST;

describe("Target whitelist", () => {
  const whitelistPath = require.resolve('./target-whitelist');
  let whitelist;
  
  beforeEach(() => {
    delete require.cache[whitelistPath];
    whitelist = require(whitelistPath);
  });
  
  after(() => process.env.TARGET_WHITELIST = originalWhitelist);
  
  describe("No whitelist", () => {
    before(() => process.env.TARGET_WHITELIST = '');
    it("Should equal true", () => expect(whitelist).to.equal(true));
  });
  
  describe("Base whitelist", () => {
    before(() => process.env.TARGET_WHITELIST = '127.0.0.1');
    
    it('Is array', () => expect(Array.isArray(whitelist)).to.equal(true));
    it('Is frozen', () => expect(Object.isFrozen(whitelist)).to.equal(true));
    it('Does not have localhost', () => expect(whitelist).not.to.include('localhost'));
    it('Has 127.0.0.1', () => expect(whitelist).to.include('127.0.0.1'));
    it('Has only 1 item', () => expect(whitelist).to.have.lengthOf(1));
  });
});