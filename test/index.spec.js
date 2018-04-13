'use strict';

const chai = require('chai');
const index = require('../src/index');

global.expect = chai.expect;

index.hello();

describe('index', () => {
    it('should do something', () => {
        expect(true).to.equal(true);
    });
});
