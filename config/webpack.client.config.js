const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const path = require('path');
module.exports = merge(baseConfig, {
    entry: ['babel-polyfill', './src/entry-client.js'],
    devServer:{
        contentBase: path.resolve(__dirname, '../public/'),
        port: 8088
    },
    output: {
        filename: '[name].[chunkhash].client.min.js',
        path: path.resolve(__dirname, '../public/')
    },
    plugins: [
        new VueSSRClientPlugin()
    ]
});