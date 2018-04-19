'use strict';

const sinon = require('sinon');

const Logger = require('../src/Logger');

const chai = require('chai');

global.expect = chai.expect;

describe('Logger', () => {
    describe('log', () => {
        let mock;

        beforeEach(() => {
            mock = sinon.mock(console);
        });

        afterEach(() => {
            mock.restore();
            mock = null;
        });

        it('sends an empty string to stdout when called with no arguments', () => {
            mock.expects('log').once().withArgs('');

            Logger.log();

            mock.verify();
        });

        it('sends "something" to stdout when called with "something"', () => {
            mock.expects('log').once().withArgs('something');

            Logger.log('something');

            mock.verify();
        });
    });

    describe('error', () => {
        let mock;

        beforeEach(() => {
            mock = sinon.mock(console);
        });

        afterEach(() => {
            mock.restore();
            mock = null;
        });

        it('sends an empty string to stderr when called with no arguments', () => {
            mock.expects('error').once().withArgs('');

            Logger.error();

            mock.verify();
        });

        it('sends "something" to stderr when called with "something"', () => {
            mock.expects('error').once().withArgs('something');

            Logger.error('something');

            mock.verify();
        });
    });
});
