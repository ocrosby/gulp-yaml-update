'use strict';

module.exports = {
    split: function (text) {
        if (!text) {
            return [];
        }

        return text.match(/[^\r\n]+/g);
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
