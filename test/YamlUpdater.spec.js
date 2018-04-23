'use strict';

const sinon = require('sinon');
const YamlUpdater = require('../src/YamlUpdater');

const chai = require('chai');

chai.use(require('chai-string'));
chai.use(require('chai-arrays'));
chai.use(require('chai-as-promised'));

chai.should();

global.expect = chai.expect;

const fakeLogger = { log: () => {}, error: () => {}};

describe('YamlUpdater', () => {
    describe('constructor', () => {
        it('assigns the default options if none are specified', () => {
            const updater = new YamlUpdater(fakeLogger);

            expect(updater.options).to.equal(YamlUpdater.DEFAULT_OPTIONS);
        });

        it('assigns the default options when given null', () => {
            const updater = new YamlUpdater(fakeLogger, null);

            expect(updater.options).to.equal(YamlUpdater.DEFAULT_OPTIONS);
        });

        it('assigns the default options when given undefined', () => {
            const updater = new YamlUpdater(fakeLogger, undefined);

            expect(updater.options).to.equal(YamlUpdater.DEFAULT_OPTIONS);
        });

        it('assigns a specified options object', () => {
            const options = {};
            const updater = new YamlUpdater(fakeLogger, options);

            expect(updater.options).to.equal(options);
        });
    });

    describe('log', () => {
        let updater;
        let testLogger;
        let logSpy;
        let errorSpy;

        beforeEach(() => {
            logSpy = sinon.spy();
            errorSpy = sinon.spy();

            testLogger = {
                log: logSpy,
                error: errorSpy
            };

            updater = new YamlUpdater(testLogger, null);
        });

        afterEach(() => {
            updater = null;
            testLogger = null;

            errorSpy = null;
            logSpy = null;
        });


        it('calls the log method on the logger when in development', () => {
            updater.options.environment = 'development';

            updater.log('something');

            expect(logSpy.calledOnce).to.equal(true);
            expect(logSpy.getCalls()[0].args).to.be.ofSize(1);
            expect(logSpy.getCalls()[0].args).to.be.containing('something');
        });

        it('does not call the log method on the logger when not in development', () => {
            updater.options.environment = 'other';

            updater.log('something');

            expect(logSpy.calledOnce).to.equal(false);
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

    describe('getEnvironment', () => {
        it('returns the environment from the specified options if it is defined', () => {
            const updater = new YamlUpdater(fakeLogger, { environment: 'something' });

            expect(updater.getEnvironment()).to.equal('something');
        });
    });

    describe('processLine', () => {
        let updater;

        before(() => {
            updater = new YamlUpdater(fakeLogger, { environment: 'test' });
        });

        after(() => {
            updater = null;
        });

        it('leaves comment lines unaltered', () => {
            expect(updater.processLine({ path: 'version', value: 'something else'}, '  # abc')).to.equal('  # abc');
        });

        it('leaves non-property lines unaltered', () => {
            expect(updater.processLine({ path: 'version', value: 'something else'}, '  - abc')).to.equal('  - abc');
        });

        it('leaves other properties lines unaltred', () => {
            expect(updater.processLine({ path: 'version', value: 'something else'}, '  title: something')).to.equal('  title: something');
        });

        it('can update the version', () => {
            expect(updater.processLine({ path: 'version', value: 'something else'}, '  version: 0.0.0')).to.equal('  version: something else');
        });
    });

    describe('getDirectives', () => {
        let updater;
        let directives;

        before(() => {
            directives = [
                { path: 'version', value: '1.0.0' },
                { path: 'title', env: 'test', value: 'Hello World!' },
                { path: 'title', env: 'development', value: 'thing1' },
                { path: 'title', env: 'production', value: 'thing2' },
                { path: 'host', env: 'development', value: 'localhost:10010' },
                { path: 'host', env: 'production', value: 'some.production.host:81' }
            ];

            updater = new YamlUpdater(fakeLogger, { environment: 'test', directives: directives });
        });

        after(() => {
            updater = null;
        });

        it('returns directives without the env property', () => {
            const results = updater.getDirectives('test');

            expect(results).to.be.ofSize(2);
            expect(results[0]).to.equal(directives[0]);
            expect(results[1]).to.equal(directives[1]);
        });
    });

    describe('update', () => {
        let updater;
        let directives;

        beforeEach(() => {
            updater = new YamlUpdater(fakeLogger, { environment: 'test', directives: directives });

            updater.options.directives = [
                { path: 'version', value: '1.0.0' },
                { path: 'title', env: 'test', value: 'Hello World!' },
                { path: 'title', env: 'development', value: 'thing1' },
                { path: 'title', env: 'production', value: 'thing2' },
                { path: 'host', env: 'development', value: 'localhost:10010' },
                { path: 'host', env: 'production', value: 'some.production.host:81' }
            ];
        });

        afterEach(() => {
            updater = null;
        });

        it('resolves a promise with an appropriately updated YAML line', () => {
            const lines = ['title: ?'];

            return updater.update(lines).should.be.fulfilled
                .then((lines) => {
                    expect(lines[0]).to.equal('title: Hello World!');
                });
        });

        it('resolves a promise with an unaltered YAML line when the directives are empty', () => {
            updater.options.directives = [];

            const lines = ['title: ?'];

            return updater.update(lines).should.be.fulfilled
                .then((lines) => {
                    expect(lines[0]).to.equal('title: ?');
                });
        });

        it('preserves empty lines', () => {
            updater.options.directives = [];

            const lines = [''];

            return updater.update(lines).should.be.fulfilled
                .then((lines) => {
                    expect(lines).to.be.ofSize(1);
                    expect(lines[0]).to.equal('');
                });
        });

        it('preserves lines containing only spaces', () => {
            updater.options.directives = [];

            const lines = ['   '];

            return updater.update(lines).should.be.fulfilled
                .then((lines) => {
                    expect(lines).to.be.ofSize(1);
                    expect(lines[0]).to.equal('   ');
                });
        });

        it('rejects a promise when getEnvironment throws an error', () => {
            const lines = ['title: ?'];

            sinon.stub(updater, 'getEnvironment').throws(new Error('getEnvironment blew up'));

            return updater.update(lines).should.be.rejectedWith('getEnvironment blew up');
        });
    });

    describe('getEnvironment', () => {
        let originalEnviornment;

        beforeEach(() => {
            originalEnviornment = process.env.NODE_ENV;
        });

        afterEach(() => {
            process.env.NODE_ENV = originalEnviornment;
        });

        it('returns the default environment when the environment is not defined on the options or the NODE_ENV variable', () => {
            const updater = new YamlUpdater();

            updater.options.environment = null;

            expect(updater.getEnvironment()).to.equal('development');
        });

        it('returns NODE_ENV when the environment is not defined on the options', () => {
            const updater = new YamlUpdater();

            updater.options.environment = null;
            process.env.NODE_ENV = 'something';

            expect(updater.getEnvironment()).to.equal('something');
        });
    });

    describe('isInDevelopment', () => {
        let getEnvironmentStub;
        let updater;

        beforeEach(() => {
            updater = new YamlUpdater();
            getEnvironmentStub = sinon.stub(updater, 'getEnvironment');
        });

        afterEach(() => {
            getEnvironmentStub.restore();
            updater = null;
        });

        it('returns true when getEnvironment returns "development"', () => {
            getEnvironmentStub.onCall(0).returns('development');

            expect(updater.isInDevelopment()).to.equal(true);
        });

        it('returns false when getEnvironment returns "production"', () => {
            getEnvironmentStub.onCall(0).returns('production');

            expect(updater.isInDevelopment()).to.equal(false);
        });

        it('returns false when getEnvironment returns "something"', () => {
            getEnvironmentStub.onCall(0).returns('something');

            expect(updater.isInDevelopment()).to.equal(false);
        });

        it('returns false when getEnvironment returns an empty string', () => {
            getEnvironmentStub.onCall(0).returns('');

            expect(updater.isInDevelopment()).to.equal(false);
        });
    });
});
