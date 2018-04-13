const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const PluginError = require('plugin-error');

const YamlUpdater = require('./YamlUpdater');

module.exports = (options) => {
    'use strict';

    const updater = new YamlUpdater(options);

    return through2.obj((file, enc, callback) => {
        // Paths are resolved by gulp.
        const filePath = file.path;
        const currentDirectory = file.cwd;
        const relativePath = path.relative(currentDirectory, filePath);

        fs.readFile(relativePath, 'utf8', (err, yaml) => {
            if (err) {
                throw new PluginError(err.message);
            }

            yaml = updater.update(yaml);

            fs.writeFile(relativePath, yaml, (err) => {
                if (err) {
                    throw new PluginError(err.message);
                }

                console.log(`Successfuly updated the file ${relativePath}.`);
            });
        });
    });
};


