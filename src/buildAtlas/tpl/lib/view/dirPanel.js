'use strict';

let {
    view, n, svgn
} = require('kabanery');

let {
    map, mergeMap
} = require('bolzano');

/**
 * render panel
 */

module.exports = view(({
    dirTreeInfo,
    onChosenFile
}) => {
    let {
        name, files
    } = dirTreeInfo;
    let width = 600,
        height = 600,
        unitCenW = 60,
        unitCenH = 60,
        unitCorW = 50,
        unitCorH = 50;

    let centerX = width / 2,
        centerY = height / 2;

    let alph = files.length && 2 * Math.PI / files.length;

    return n('div', {
        style: {
            textAlign: 'center',
            padding: 10
        }
    }, [
        svgn('svg', {
            width,
            height
        }, [
            renderNode(mergeMap(getCenterPosition(width, height, unitCenW, unitCenH), {
                text: name,
                uw: unitCenW,
                uh: unitCenH,
                color: 'rgba(0, 53, 64, 1)'
            })),

            map(files, (file, index) => {
                return renderNode(mergeMap(getCornerPosition(unitCorW, unitCorH, alph, index, 50, centerY, centerX, centerY), {
                    text: basename(file.name),
                    uw: unitCorW,
                    uh: unitCorH,
                    color: 'rgba(0, 53, 64, 1)',
                    onChosen: () => onChosenFile && onChosenFile(file, index, files)
                }));
            })
        ])
    ]);
});

let basename = (fileName) => {
    let parts = fileName.split('.');
    if(parts.length > 1) return parts.slice(0, -1).join('.');
    return fileName;
};

/*
let offset = (p, dp) => {
    return {
        x: p.x - dp.x,
        y: p.y - dp.y
    };
};
*/

let renderNode = ({
    text,
    x,
    y,
    uw,
    uh,
    color,
    onChosen,
    textColor = 'white', textSize = 16,
}) => {
    return svgn('svg', {
        onclick: () => {
            onChosen && onChosen();
        }
    }, [
        svgn('circle', {
            cx: x + uw / 2,
            cy: y + uh / 2,
            r: uw,
            fill: color
        }),
        svgn('text', {
            style: {
                fontSize: textSize
            },
            x,
            y,
            fill: textColor
        }, text),
    ]);
};

let getCenterPosition = (w, h, cw, ch) => {
    return {
        x: (w - cw) / 2,
        y: (h - ch) / 2
    };
};

let getCornerPosition = (cw, ch, alph, index, x1, y1, x0, y0) => {
    let {
        x, y
    } = rotate(x1, y1, x0, y0, alph * index);
    return {
        x: x - cw / 2,
        y: y - ch / 2
    };
};

let rotate = (x1, y1, x0, y0, angle) => {
    let x = x1 - x0;
    let y = y1 - y0;

    let r = Math.sqrt(x * x + y * y);
    if (r === 0) return {
        x: x1,
        y: y1
    };
    let cos_alpah = x / r;
    let sin_alpha = y / r;

    let cos_beta = Math.cos(angle);
    let sin_beta = Math.sin(angle);

    let x2 = r * (cos_alpah * cos_beta - sin_alpha * sin_beta);
    let y2 = r * (sin_alpha * cos_beta + cos_alpah * sin_beta);

    return {
        x: x0 + x2,
        y: y0 + y2
    };
};
