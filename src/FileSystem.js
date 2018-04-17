'use strict';

const fs = require('fs');
const bluebird = require('bluebird');
const Lines = require('./Lines');

global.Promise = bluebird.Promise;

module.exports = {
    readFile: function (filePath, logger) {
        return new Promise((resolve, reject) => {
            logger.log(`Reading the file "${filePath}" ...`);
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    },

    writeFile: function (filePath, content, logger) {
        return new Promise((resolve, reject) => {
            logger.log(`Writing the file "${filePath}" ...`);
            fs.writeFile(filePath, content, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },

    readLines: function (filePath, logger) {
        return new Promise((resolve, reject) => {
            logger.log(`Reading lines from "${filePath}" ...`);
            this.readFile(filePath, logger)
                .then((content) => {
                    const lines = Lines.split(content);

                    logger.log(`There are ${lines.length} lines in "${filePath}".`);

                    resolve(lines);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    writeLines: function (filePath, lines, logger) {
        logger.log(`Writing lines to "${filePath}" ...`);
        return new Promise((resolve, reject) => {
            const content = Lines.join(lines);

            // Write the updated file contents.
            this.writeFile(filePath, content, logger)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};
