'use strict';

// const fs = require('fs');
// const through2 = require('through2');

const FileSystem = require('../src/FileSystem');
const chai = require('chai');
const bluebird = require('bluebird');
const sinon = require('sinon');

global.Promise = bluebird.Promise;

chai.use(require('chai-string'));
chai.use(require('chai-arrays'));
chai.use(require('chai-as-promised'));

const index = require('../src/index')({
    environment: 'development',
    directives: []
});

global.expect = chai.expect;

describe('index', () => {
    it('should leave a file with two comment lines unaltered', (done) => {
        const readLinesStub = sinon.stub(FileSystem, 'readLines');
        const mockedFileSystem = sinon.mock(FileSystem);
        const file = {cwd: process.cwd(), path: 'test/data/example.yaml'};

        readLinesStub.returns(Promise.resolve(['# Hello', '# World']));
        mockedFileSystem.expects('writeLines').once().returns(Promise.resolve());

        index.write(file, 'utf8', (err, lines) => {
            expect(lines).to.be.ofSize(2);
            expect(lines[0]).to.equal('# Hello');
            expect(lines[1]).to.equal('# World');

            mockedFileSystem.verify();
            mockedFileSystem.restore();

            done();
        });
    });

    it('should throw a plugin error when one of the promises in the promise chain gets rejected', (done) => {
        const readFileStub = sinon.stub(FileSystem, 'readFile');
        const file = {cwd: process.cwd(), path: 'test/data/missing.yaml'};

        readFileStub.throws('Error', 'Kaboom!');

        index.write(file, 'utf8', (err, result) => {
            expect(err.message).to.equal('Kaboom!');
            expect(result).to.equal(undefined);

            readFileStub.restore();
            done();
        });
    });
});
