'use strict';

let {
    forEach
} = require('bolzano');

let {
    n
} = require('kabanery');

module.exports = () => {
    let dataMap = {};

    let queueMap = {};

    let scriptingMap = {};

    window.jsData = (id, data) => {
        dataMap[id] = data;
        delete scriptingMap[id];

        forEach(queueMap[id], ({
            resolve
        }) => {
            resolve(data);
        });

        delete queueMap[id];
    };

    // TODO handle error
    let loadScript = (id) => {
        if (scriptingMap[id]) return;
        document.body.appendChild(n(`script src="${getDataUrl(id)}"`));
        scriptingMap[id] = true;
    };

    let getData = (id, dir) => {
        if (dataMap[id]) return Promise.resolve(dataMap[id]);

        if (dir) {
            loadScript(`${dir}/${id}`);
        } else {
            loadScript(id);
        }

        return new Promise((resolve, reject) => {
            queueMap[id] = queueMap[id] || [];
            queueMap[id].push({
                resolve, reject
            });
        });
    };

    return {
        getData
    };
};

let getDataUrl = (id) => {
    return `./data/${id}.js`;
};
