'use strict';

const chai = require('chai');
const YamlUpdater = require('../src/YamlUpdater');

global.expect = chai.expect;

describe('YamlUpdater', () => {
    describe('constructor', () => {
        it('assigns the default options if none are specified', () => {
            const updater = new YamlUpdater();

            expect(updater.options).to.equal(YamlUpdater.DEFAULT_OPTIONS);
        });

        it('assigns the default options when given null', () => {
            const updater = new YamlUpdater(null);

            expect(updater.options).to.equal(YamlUpdater.DEFAULT_OPTIONS);
        });

        it('assigns the default options when given undefined', () => {
            const updater = new YamlUpdater(undefined);

            expect(updater.options).to.equal(YamlUpdater.DEFAULT_OPTIONS);
        });

        it('assigns a specified options object', () => {
            const options = {};
            const updater = new YamlUpdater(options);

            expect(updater.options).to.equal(options);
        });
    });

    describe('IsInDevelopment', () => {
        let original;

        beforeEach(() => {
            original = process.env.NODE_ENV;
        });

        afterEach(() => {
            process.env.NODE_ENV = original;
        });

        it('returns true when the NODE_ENV variable is set to "development"', () => {
            process.env.NODE_ENV = 'development';

            expect(YamlUpdater.IsInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "  development"', () => {
            process.env.NODE_ENV = '  development';

            expect(YamlUpdater.IsInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "development  "', () => {
            process.env.NODE_ENV = 'development  ';

            expect(YamlUpdater.IsInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to " development  "', () => {
            process.env.NODE_ENV = ' development  ';

            expect(YamlUpdater.IsInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "DEVELOPMENT"', () => {
            process.env.NODE_ENV = 'DEVELOPMENT';

            expect(YamlUpdater.IsInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "Development"', () => {
            process.env.NODE_ENV = 'Development';

            expect(YamlUpdater.IsInDevelopment()).to.equal(true);
        });

        it('returns false when the NODE_ENV varible is set to "production"', () => {
            process.env.NODE_ENV = 'production';

            expect(YamlUpdater.IsInDevelopment()).to.equal(false);
        });

        it('returns false when the NODE_ENV varible is set to "something"', () => {
            process.env.NODE_ENV = 'something';

            expect(YamlUpdater.IsInDevelopment()).to.equal(false);
        });

        it('returns false when the NODE_ENV varible is empty', () => {
            process.env.NODE_ENV = '';

            expect(YamlUpdater.IsInDevelopment()).to.equal(false);
        });

        it('returns false when the NODE_ENV varible contains only spaces', () => {
            process.env.NODE_ENV = '     ';

            expect(YamlUpdater.IsInDevelopment()).to.equal(false);
        });
    });
});
