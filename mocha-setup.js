const chai = require('chai');

global.expect = chai.expect;
global.assert = chai.assert;

global.request = require('supertest');

Object.defineProperty(global, 'express', {
  get: () => require('./server/extend-express')
});
