global.Promise = require('bluebird').Promise;

module.exports = (() => {
    'use strict';

    function YamlUpdater(logger, options) {
        logger = logger || console;
        options = options || YamlUpdater.DEFAULT_OPTIONS;

        this.options = options;
        this.logger = logger;
    }
    YamlUpdater.DEFAULT_ENVIRONMENT = 'development';

    YamlUpdater.DEFAULT_OPTIONS = {
        directives: []
    };

    YamlUpdater.SplitPath = function (path) {
        if (!path) {
            return [];
        }

        path = path.trim();

        if (path.startsWith('/')) {
            path = path.substr(1);
        }

        return path.split('/');
    };

    YamlUpdater.prototype.getEnvironment = function () {
        if (this.options.environment) {
            return this.options.environment;
        }

        if (!process.env.NODE_ENV) {
            return YamlUpdater.DEFAULT_ENVIRONMENT;
        }

        return process.env.NODE_ENV.trim().toLowerCase();
    };

    /**
     * @return {boolean}
     */
    YamlUpdater.prototype.isInDevelopment = function () {
        return this.getEnvironment() === 'development';
    };

    /**
     * Conditionally displays logging messages depending on whether or not we are in development mode.
     *
     * @param message
     */
    YamlUpdater.prototype.log = function (message) {
        if (this.isInDevelopment()) {
            this.logger.log(message);
        }
    };

    YamlUpdater.IsCommentLine = function (line) {
        if (typeof line === 'string') {
            return line.trim().startsWith('#');
        }

        return false;
    };

    YamlUpdater.IsPropertyLine = function (line) {
        if (typeof line === 'string') {
            return line.indexOf(':') > 0;
        }

        return false;
    };

    /**
     * Applies the specified directive to the given line.
     *
     * @param directive
     * @param line
     * @returns {*}
     */
    YamlUpdater.prototype.processLine = function (directive, line) {
        const tokens = YamlUpdater.SplitPath(directive.path);

        let pos;
        let property;
        let processedLine;

        if (YamlUpdater.IsCommentLine(line)) {
            return line;
        }

        if (!YamlUpdater.IsPropertyLine(line)) {
            return line;
        }

        property = `${tokens[0]}:`;
        pos = line.indexOf(property);

        if (pos < 0) {
            // The specified property was not found.
            return line;
        }

        processedLine = `${line.substr(0, pos + property.length)} ${directive.value}`;

        return processedLine;
    };

    /**
     * Executes directives against a yaml file.
     *
     * @param directive
     * @param offset
     * @param count
     * @param yaml
     * @returns {*}
     */
    YamlUpdater.prototype.exec = function (directive, offset, count, lines) {
        let i;

        for (i = 0 ; i < lines.length ; i++) {
            lines[i] = this.processLine(directive, lines[i]);
        } // end for
    };

    /**
     * Retrieve a filtered set of directives appropriate for the specified environment.
     *
     * @param environment
     * @returns {Array}
     */
    YamlUpdater.prototype.getDirectives = function(environment) {
        const directives = this.options.directives;
        const directiveCount = directives.length;

        let i;
        let currentDirective;
        let selectedDirectives = [];

        for (i = 0 ; i < directiveCount ; i++) {
            currentDirective = directives[i];

            if (!currentDirective.env) {
                selectedDirectives.push(currentDirective);
                continue;
            }

            if (environment === currentDirective.env) {
                selectedDirectives.push(currentDirective);
            } else {
                // this.logger.log(`Skipping the directive ${JSON.stringify(currentDirective)}`);
            }
        } // end for

        return selectedDirectives;
    };

    /**
     * Updates a yaml document according to the specified array of directives.
     *
     * @param yaml
     * @returns {*}
     */
    YamlUpdater.prototype.update = function(lines) {
        return new Promise((resolve, reject) => {
            let i;
            let directives;
            let environment;
            let directiveCount;
            let currentDirective;

            try {
                environment = this.getEnvironment();

                this.log(`The environment is "${environment}".`);
                this.log(`There are ${lines.length} lines.`);
                this.log();

                directives = this.getDirectives(environment);
                directiveCount = directives.length;

                this.log();

                if (directiveCount === 0) {
                    this.log('There are no directives to execute.');

                    resolve(lines);
                } else {
                    this.log(`Directive count: ${directiveCount}`);

                    for (i = 0; i < directiveCount; i++) {
                        currentDirective = directives[i];
                        this.exec(currentDirective, i, directives.length, lines);
                    } // end for

                    this.log();

                    resolve(lines);
                }

            } catch (err) {
                reject(err);
            }
        });
    };

    return YamlUpdater;
})();
