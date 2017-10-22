const assert = require('assert');

describe('Including Redis', () => {
  it('Should fail', () => {
    assert.throws(() => {
      require('../server/redis');
    }, 'REDISCLOUD_URL environment variable missing! Please reinstall the button.');
  });
});