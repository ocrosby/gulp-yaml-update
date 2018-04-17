'use strict';

module.exports = {
    log: function (message) {
        if (!message) {
            message = '';
        }

        console.log(message);
    },

    error: function (message) {
        if (!message) {
            message = '';
        }

        console.error(message);
    }
};
