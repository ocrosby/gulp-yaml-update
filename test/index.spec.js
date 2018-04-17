'use strict';

const chai = require('chai');
const indexFunction = require('../src/index');

global.expect = chai.expect;

describe('index', () => {
    it('should do something', () => {
        const index = indexFunction({
            environment: 'development',
            directives: []
        });

        expect(true).to.equal(true);
    });
});
