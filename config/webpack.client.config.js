const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const path = require('path');
module.exports = merge(baseConfig, {
    entry: ['babel-polyfill', './src/entry-client.js'],
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'manifest',
                    minChunks: Infinity
                }
            }
        }
    },
    plugins: [
        new VueSSRClientPlugin()
    ]
});
