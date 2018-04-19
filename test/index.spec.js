'use strict';

// const through2 = require('through2');

const fs = require('fs');
const FileSystem = require('../src/FileSystem');
const chai = require('chai');
const bluebird = require('bluebird');
const sinon = require('sinon');

global.Promise = bluebird.Promise;

chai.use(require('chai-string'));
chai.use(require('chai-arrays'));
chai.use(require('chai-as-promised'));

const index = require('../src/index');

global.expect = chai.expect;

describe('index', () => {
    let mockedFileSystem;

    beforeEach(() => {
        mockedFileSystem = sinon.mock(fs);
    });

    afterEach(() => {
        mockedFileSystem.restore();
        mockedFileSystem = null;
    });

    it('should leave a file with two comment lines unaltered', (done) => {
        const file = {cwd: process.cwd(), path: 'test/data/example.yaml'};
        const stream = index({ environment: 'development', directives: [] });

        let lines;

        mockedFileSystem.expects('readFile').once().yields(null, '# Hello\r\n# World');
        mockedFileSystem.expects('writeFile').once().yields(null);

        stream.on('data', (results) => {
            lines = results;
        });

        stream.once('end', () => {
            expect(lines).to.be.array();
            expect(lines).to.be.ofSize(2);
            expect(lines[0]).to.equal('# Hello');
            expect(lines[1]).to.equal('# World');

            mockedFileSystem.verify();

            done();
        });

        stream.write(file, 'utf8');
        stream.end();
    });

    it('should throw a plugin error when fs.writeFile blows up', (done) => {
        const file = {cwd: process.cwd(), path: 'test/data/example.yaml'};
        const stream = index({ environment: 'development', directives: [] });

        let err;

        mockedFileSystem.expects('readFile').once().yields(null, '# Hello\r\n# World');
        mockedFileSystem.expects('writeFile').once().yields(new Error('Kaboom!'));

        stream.on('error', (err) => {
            expect(err.plugin).to.equal('gulp-yaml-update');
            expect(err.message).to.equal('Kaboom!');

            mockedFileSystem.verify();

            done();
        });

        stream.write(file, 'utf8');
        stream.end();
    });
});
