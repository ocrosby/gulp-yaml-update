'use strict';

const chai = require('chai');
const Lines = require('../src/Lines');

chai.use(require('chai-string'));
chai.use(require('chai-arrays'));

global.expect = chai.expect;

describe('Lines', () => {
    describe('split', () => {
        it('returns an empty array when given nothing', () => {
             expect(Lines.split()).to.be.ofSize(0);
        });

        it('returns an empty array when given null', () => {
            expect(Lines.split(null)).to.be.ofSize(0);
        });

        it('returns an empty array when given undefined', () => {
            expect(Lines.split(undefined)).to.be.ofSize(0);
        });

        it('returns an empty array when given an empty string', () => {
            const result = Lines.split('');

            expect(result).to.be.ofSize(0);
        });

        it('returns an array containing two empty strings when given "\\r\\n"', () => {
            const result = Lines.split('\r\n');

            expect(result).to.be.ofSize(2);
            expect(result[0]).to.equal('');
            expect(result[1]).to.equal('');
        });

        it('returns an array containing three empty string when given "\\r\\n\\r\\n"', () => {
            const result = Lines.split('\r\n\r\n');

            expect(result).to.be.ofSize(3);
            expect(result[0]).to.equal('');
            expect(result[1]).to.equal('');
            expect(result[2]).to.equal('');
        });

        it('returns an array ["abc"] when given "abc"', () => {
            const result = Lines.split('abc');

            expect(result).to.be.ofSize(1);
            expect(result[0]).to.equal('abc');
        });
    });

    describe('join', () => {
        it('returns an empty string when given nothing', () => {
            expect(Lines.join()).to.equal('');
        });

        it('returns an empty string when given null', () => {
            expect(Lines.join(null)).to.equal('');
        });

        it('returns an empty string when given undefined', () => {
            expect(Lines.join(undefined)).to.equal('');
        });

        it('returns an empty string when given an empty array', () => {
            expect(Lines.join([])).to.equal('');
        });

        it('returns a string containing "abc\\r\\n" when given the array ["abc"]', () => {
            expect(Lines.join(['abc'])).to.equal('abc\r\n');
        });

        it('returns a string containing "abc\\r\\ndef\\r\\n", when given the array ["abc", "def"]', () => {
           expect(Lines.join(['abc', 'def'])).to.equal('abc\r\ndef\r\n');
        });
    });
});
