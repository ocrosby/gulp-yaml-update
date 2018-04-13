module.exports = (() => {
    'use strict';

    function YamlUpdater(options) {
        if (!options) {
            options = YamlUpdater.DEFAULT_OPTIONS;
        }

        this.options = options;
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
            console.log(message);
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
                // console.log(`Skipping the directive ${JSON.stringify(currentDirective)}`);
            }
        } // end for

        return selectedDirectives;
    };

    /**
     * Updates a yaml document according to the specified array of directives.
     *
     * @param directives
     * @param yaml
     * @returns {*}
     */
    YamlUpdater.prototype.update = function(yaml) {
        const environment = this.getEnvironment();
        const lines = yaml.match(/[^\r\n]+/g);

        let i;
        let currentLine;
        let currentDirective;
        let directives;
        let directiveCount;

        this.log(`The environment is "${environment}".`);
        this.log(`There are ${lines.length} lines.`);
        this.log();

        directives = this.getDirectives(environment);
        directiveCount = directives.length;

        this.log();

        if (directiveCount === 0) {
            this.log('There are no directives to execute.');

            return yaml;
        }

        if (directiveCount === 1) {
            this.log('There is a single directive to execute.');
        } else {
            this.log(`There are ${directiveCount} directives to execute.`);
        }

        for (i = 0; i < directiveCount; i++) {
            currentDirective = directives[i];
            this.exec(currentDirective, i, directives.length, lines);
        } // end for

        this.log();

        // Build the updated YAML file.
        yaml = '';
        for (i = 0 ; i < lines.length ; i++) {
            currentLine = lines[i];
            yaml += `${currentLine}\r`;
        }

        return yaml;
    };

    return YamlUpdater;
})();
