const path = require('path');
const through2 = require('through2');
const PluginError = require('plugin-error');
const FileSystem = require('./FileSystem');
const Logger = require('./Logger');
const YamlUpdater = require('./YamlUpdater');
const packageMetadata = require('../package.json');

module.exports = (options) => {
    'use strict';

    const updater = new YamlUpdater(Logger, options);

    return through2.obj((file, enc, callback) => {
        const relativePath = path.relative(file.cwd, file.path);

        let tempLines;
        let error;

        FileSystem.readLines(relativePath, Logger)
            .then((lines) => {
                return updater.update(lines);
            })
            .then((lines) => {
                tempLines = lines;
                return FileSystem.writeLines(relativePath, lines, Logger);
            })
            .then(() => {
                Logger.log(`Successfuly updated the file "${relativePath}".`);
                callback(null, tempLines);
            })
            .catch((err) => {
                callback(new PluginError(packageMetadata.name, err, { showStack: true }));
            })
    });
};


