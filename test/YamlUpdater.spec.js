'use strict';

const chai = require('chai');
const YamlUpdater = require('../src/YamlUpdater');

chai.use(require('chai-string'));
chai.use(require('chai-arrays'));

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

    describe('SplitPath', () => {
        it('returns an empty array when given nothing', () => {
            expect(YamlUpdater.SplitPath()).to.be.ofSize(0);
        });

        it('returns an empty array when given null', () => {
            expect(YamlUpdater.SplitPath(null)).to.be.ofSize(0);
        });

        it('returns an empty array when given undefined', () => {
            expect(YamlUpdater.SplitPath(undefined)).to.be.ofSize(0);
        });

        it('returns an empty array when given an empty string', () => {
            expect(YamlUpdater.SplitPath('')).to.be.ofSize(0);
        });

        it('returns an array containing "something" when given "something"', () => {
            const tokens = YamlUpdater.SplitPath('something');

            expect(tokens).to.be.ofSize(1);
            expect(tokens[0]).to.equal('something');
        });

        it('returns an array containing "something" when given "/something"', () => {
            const tokens = YamlUpdater.SplitPath('/something');

            expect(tokens).to.be.ofSize(1);
            expect(tokens[0]).to.equal('something');
        });

        it('returns an array containing "something" when given "   /something"', () => {
            const tokens = YamlUpdater.SplitPath('   /something');

            expect(tokens).to.be.ofSize(1);
            expect(tokens[0]).to.equal('something');
        });

    });

    describe('IsPropertyLine', () => {
        it('returns false when given nothing', () => {
            expect(YamlUpdater.IsPropertyLine()).to.equal(false);
        });

        it('returns false when given null', () => {
            expect(YamlUpdater.IsPropertyLine(null)).to.equal(false);
        });

        it('returns false when given undefined', () => {
            expect(YamlUpdater.IsPropertyLine(undefined)).to.equal(false);
        });

        it('returns false when given an empty string', () => {
            expect(YamlUpdater.IsPropertyLine('')).to.equal(false);
        });

        it('returns false when given a line containing only spaces', () => {
            expect(YamlUpdater.IsPropertyLine('      ')).to.equal(false);
        });

        it('returns false when given "#"', () => {
            expect(YamlUpdater.IsPropertyLine('#')).to.equal(false);
        });

        it('returns false when given "#   "', () => {
            expect(YamlUpdater.IsPropertyLine('#   ')).to.equal(false);
        });

        it('returns false when given "# something"', () => {
            expect(YamlUpdater.IsPropertyLine('# something')).to.equal(false);
        });

        it('returns false when given "   # something"', () => {
            expect(YamlUpdater.IsPropertyLine('   # something')).to.equal(false);
        });

        it('returns false when given "   # something  "', () => {
            expect(YamlUpdater.IsPropertyLine('   # something  ')).to.equal(false);
        });

        it('returns true when given "swagger: \"2.0\""', () => {
            expect(YamlUpdater.IsPropertyLine('swagger: "2.0"')).to.equal(true);
        });
    });

    describe('IsCommentLine', () => {
        it('returns false when given nothing', () => {
            expect(YamlUpdater.IsCommentLine()).to.equal(false);
        });

        it('returns false when given null', () => {
            expect(YamlUpdater.IsCommentLine(null)).to.equal(false);
        });

        it('returns false when given undefined', () => {
            expect(YamlUpdater.IsCommentLine(undefined)).to.equal(false);
        });

        it('returns false when given an empty string', () => {
            expect(YamlUpdater.IsCommentLine('')).to.equal(false);
        });

        it('returns false when given a line containing only spaces', () => {
            expect(YamlUpdater.IsCommentLine('      ')).to.equal(false);
        });

        it('returns true when given "#"', () => {
            expect(YamlUpdater.IsCommentLine('#')).to.equal(true);
        });

        it('returns true when given "#   "', () => {
            expect(YamlUpdater.IsCommentLine('#   ')).to.equal(true);
        });

        it('returns true when given "# something"', () => {
            expect(YamlUpdater.IsCommentLine('# something')).to.equal(true);
        });

        it('returns true when given "   # something"', () => {
            expect(YamlUpdater.IsCommentLine('   # something')).to.equal(true);
        });

        it('returns true when given "   # something  "', () => {
            expect(YamlUpdater.IsCommentLine('   # something  ')).to.equal(true);
        });
    });

    describe('isInDevelopment', () => {
        let original;
        let updater;

        before(() => {
            updater = new YamlUpdater();
        });

        after(() => {
            updater = null;
        });

        beforeEach(() => {
            original = process.env.NODE_ENV;
        });

        afterEach(() => {
            process.env.NODE_ENV = original;
        });

        it('returns true when the NODE_ENV variable is set to "development"', () => {
            process.env.NODE_ENV = 'development';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "  development"', () => {
            process.env.NODE_ENV = '  development';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "development  "', () => {
            process.env.NODE_ENV = 'development  ';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to " development  "', () => {
            process.env.NODE_ENV = ' development  ';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "DEVELOPMENT"', () => {
            process.env.NODE_ENV = 'DEVELOPMENT';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns true when the NODE_ENV variable is set to "Development"', () => {
            process.env.NODE_ENV = 'Development';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns false when the NODE_ENV varible is set to "production"', () => {
            process.env.NODE_ENV = 'production';

            expect(updater.isInDevelopment()).to.equal(false);
        });

        it('returns false when the NODE_ENV varible is set to "something"', () => {
            process.env.NODE_ENV = 'something';

            expect(updater.isInDevelopment()).to.equal(false);
        });

        it('returns true when the NODE_ENV varible is empty', () => {
            process.env.NODE_ENV = '';

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns false when the NODE_ENV varible contains only spaces', () => {
            process.env.NODE_ENV = '     ';

            expect(updater.isInDevelopment()).to.equal(false);
        });
    });
});