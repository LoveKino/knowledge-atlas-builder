'use strict';

let ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        index: ['./lib/index.js']
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ],
    output: {
        path: __dirname,
        filename: '[name].js'
    }
};
