const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const path = require('path');
module.exports = merge(baseConfig, {
    entry: ['babel-polyfill', './src/entry-client.js'],
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    }
});
