'use strict';

// const fs = require('fs');
// const through2 = require('through2');

const chai = require('chai');

const index = require('../src/index')({
    environment: 'development',
    directives: []
});

global.expect = chai.expect;

describe('index', () => {
    it('should do something', (done) => {
        const file = {cwd: process.cwd(), path: 'test/data/example.yaml'};
        const encoding = 'utf8';

        index.write(file, encoding, () => {
            // Todo: Figure out how to test that the plugin did what was expected to the example file.
            expect(true).to.equal(true);
            done();
        });
    });

    xit('should throw an error when the file is missing', (done) => {
        const file = {cwd: process.cwd(), path: 'test/data/missing.yaml'};
        const encoding = 'utf8';

        index.write(file, encoding, () => {
            // Todo: Figure out how to test that the plugin did what was expected to the example file.
            expect(true).to.equal(true);
            done();
        });
    });
});
