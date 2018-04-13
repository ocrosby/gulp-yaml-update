module.exports = (() => {
    'use strict';

    function YamlUpdater(options) {
        if (!options) {
            options = YamlUpdater.DEFAULT_OPTIONS;
        }

        this.options = options;
    }

    YamlUpdater.DEFAULT_OPTIONS = {

    };

    /**
     * @return {boolean}
     */
    YamlUpdater.IsInDevelopment = function () {
        return process.env.NODE_ENV.trim().toLowerCase() === 'development';
    };

    /**
     * Conditionally displays logging messages depending on whether or not we are in development mode.
     *
     * @param message
     */
    YamlUpdater.prototype.log = function (message) {
        if (YamlUpdater.IsInDevelopment()) {
            console.log(message);
        }
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
    YamlUpdater.prototype.exec = function (directive, offset, count, yaml) {
        this.log(`Executing directive ${offset+1} of ${count} ...`);
        this.log(`Todo: Execute the directive ${JSON.stringify(directive)}...`);

        return yaml;
    };

    /**
     * Updates a yaml document according to the specified array of directives.
     *
     * @param directives
     * @param yaml
     * @returns {*}
     */
    YamlUpdater.prototype.update = function(directives, yaml) {
        let i;
        let currentDirective;

        if (!Array.isArray(directives)) {
            throw new Error('You must pass an array of directives!');
        }

        if (directives.length === 0) {
            this.log('There are no directives to execute.');

            return yaml;
        }

        if (directives.length === 1) {
            this.log('There is a single directive to execute.');
        } else {
            this.log(`There are ${directives.length} directives to execute.`);
        }

        for (i = 0; i < directives.length; i++) {
            currentDirective = directives[i];
            yaml = this.exec(currentDirective, i, directives.length, yaml);
        } // end for

        return yaml;
    };

    return YamlUpdater;
})();
