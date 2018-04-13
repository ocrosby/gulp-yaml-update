const path = require('path');
const through2 = require('through2');

// const YamlUpdater = require('./YamlUpdater');

module.exports = (options) => {
    'use strict';

    return through2.obj((file, enc, callback) => {
        // Paths are resolved by gulp.
        const filepath = file.path;
        const cwd = file.cwd;
        const relative = path.relative(cwd, filepath);

        console.log('got here');
    });
};


