const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const PluginError = require('plugin-error');
const FileSystem = require('./FileSystem');
const Logger = require('./Logger');
const YamlUpdater = require('./YamlUpdater');

module.exports = (options) => {
    'use strict';

    const updater = new YamlUpdater(options, Logger);

    return through2.obj((file, enc, callback) => {
        // Paths are resolved by gulp.
        const filePath = file.path;
        const currentDirectory = file.cwd;
        const relativePath = path.relative(currentDirectory, filePath);

        FileSystem.readLines(relativePath, Logger)
            .then((lines) => {
                const yaml = updater.update(lines);

                FileSystem.writeFile(relativePath, yaml, Logger)
                    .then(() => {
                        console.log(`Successfuly updated the file "${relativePath}".`);
                    })
                    .catch((err) => {
                        throw new PluginError(err.message);
                    });
            })
            .catch((err) => {
                throw new PluginError(err.message);
            });
    });
};


