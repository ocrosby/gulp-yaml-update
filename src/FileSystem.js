'use strict';

const fs = require('fs');
const bluebird = require('bluebird');

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
            this.readFile(filePath, logger)
                .then((content) => {
                    let lines;

                    lines = content.match(/[^\r\n]+/g);

                    logger.log(`There are ${lines.length} lines in "${filePath}".`);

                    resolve(lines);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    writeLines: function (filePath, lines, logger) {

    }
};
