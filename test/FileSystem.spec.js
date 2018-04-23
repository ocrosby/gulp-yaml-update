'use strict';

const fs = require('fs');
const sinon = require('sinon');

const FileSystem = require('../src/FileSystem');

const chai = require('chai');

chai.use(require('chai-string'));
chai.use(require('chai-arrays'));
chai.use(require('chai-as-promised'));

chai.should();

global.expect = chai.expect;

const fakeLogger = { log: () => {}, error: () => {}};

describe('FileSystem', () => {
    describe('readFile', () => {
        afterEach(() => {
            fs.readFile.restore();
        });

        it('resolves a promise when the readFile method returns successfully', () => {
            sinon.stub(fs, 'readFile').yields(null, 'LOLYESITDOES');

            return FileSystem.readFile('something', fakeLogger).should.eventually.equal('LOLYESITDOES');
        });

        it('rejects a promise when the readFile method returns an error', () => {
            const err = new Error('Some cool error!');

            sinon.stub(fs, 'readFile').yields(err, null);

            return FileSystem.readFile('something', fakeLogger).should.rejectedWith('Some cool error!');
        });
    });

    describe('readLines', () => {
        afterEach(() => {
            fs.readFile.restore();
        });

        it('resolves a promise with an empty array when the readFile method returns an empty string', () => {
            sinon.stub(fs, 'readFile').yields(null, '');

            return FileSystem.readLines('something', fakeLogger).should.be.fulfilled
                .then((lines) => {
                    expect(lines).to.be.ofSize(0);
                });
        });

        it('preserves empty lines', () => {
            sinon.stub(fs, 'readFile').yields(null, '\r\n');

            return FileSystem.readLines('something', fakeLogger).should.be.fulfilled
                .then((lines) => {
                    expect(lines).to.be.ofSize(2);
                    expect(lines[0]).to.equal('');
                    expect(lines[0]).to.equal('');
                });
        });

        it('rejects a promise when the readFile method returns an error', () => {
            const err = new Error('Some other cool error!');

            sinon.stub(fs, 'readFile').yields(err, null);

            return FileSystem.readLines('something', fakeLogger).should.be.rejectedWith('Some other cool error!');
        });
    });

    describe('writeFile', () => {
        afterEach(() => {
            fs.writeFile.restore();
        });

        it('resolves a promise when the readFile method returns successfully', () => {
            sinon.stub(fs, 'writeFile').yields(null, 'LOLYESITDOES');

            return FileSystem.writeFile('something', 'contents', fakeLogger).should.be.fulfilled;
        });

        it('rejects a promise when the readFile method returns an error', () => {
            const err = new Error('Some cool error!');

            sinon.stub(fs, 'writeFile').yields(err, null);

            return FileSystem.writeFile('something', 'contents', fakeLogger).should.be.rejectedWith('Some cool error!');
        });
    });

    describe('writeLines', () => {
        afterEach(() => {
            fs.writeFile.restore();
        });

        it('resolves a promise when the writeFile method returns successfully', () => {
            sinon.stub(fs, 'writeFile').yields(null, 'Something Neat!');

            return FileSystem.writeLines('/some/file/path', 'content', fakeLogger).should.be.fulfilled;
        });

        it('rejects a promise when the readFile method returns an error', () => {
            const err = new Error('Hello World!');

            sinon.stub(fs, 'writeFile').yields(err, null);

            return FileSystem.writeLines('/some/file/path', 'content', fakeLogger).should.be.rejectedWith('Hello World!');
        });
    });
});
