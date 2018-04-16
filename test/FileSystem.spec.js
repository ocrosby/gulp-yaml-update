const fs = require('fs');
const sinon = require('sinon');

const FileSystem = require('../src/FileSystem');

describe('FileSystem', () => {
    describe('readFile', () => {
        it('resolves a promise when the readFile method returns successfully', () => {
            sinon.stub(fs, 'readFile').yields(null, "LOLYESITDOES");

            FileSystem.readFile('something')
                .then((content) => {
                    expect(content).to.equal('?');
                });
        });
    });

    describe('readLines', () => {

    });

    describe('writeFile', () => {

    });

    describe('writeLines', () => {

    });
});
