'use strict';

let parseSimpleKVLine = (line) => {
    let parts = line.split(/\s/);
    return parts.reduce((prev, part) => {
        part = part.trim();
        if (part) {
            let [key, ...rest] = part.split('=');
            prev[key] = rest.join('=');
        }

        return prev;
    }, {});
};

module.exports = {
    parseSimpleKVLine
};
