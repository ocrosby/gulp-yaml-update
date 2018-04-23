'use strict';

module.exports = {
    split: function (text) {
        let results;

        if (!text) {
            return [];
        }

        //results = text.match(/[^\r\n]+/g);
        results = text.replace(/\r\n|\n\r|\n|\r/g, '\n').split('\n');

        if (!results) {
            return [];
        }

        return results;
    },

    join: function (lines) {
        let i;
        let content;
        let currentLine;

        if (!lines) {
            return '';
        }

        content = '';
        for (i = 0; i < lines.length; i++) {
            currentLine = lines[i];
            content += `${currentLine}\r\n`;
        } // end for

        return content;
    }
};
