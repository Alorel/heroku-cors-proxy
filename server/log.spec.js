describe("Log", () => {
  const Log = require('./log');
  
  it("Is frozen", () => expect(Object.isFrozen(Log)).to.equal(true));
  
  const levels = [
    'emerg',
    'alert',
    'crit',
    'error',
    'warning',
    'notice',
    'info',
    'debug'
  ];
  
  for (const level of levels) {
    it(`Has level ${level}`, () => expect(level in Log).to.equal(true));
  }
});