const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
module.exports = merge(baseConfig, {
    target: 'node',
    entry: './src/entry-server.js',
    output: {
        libraryTarget: 'commonjs2',
        filename: '[name].server.min.js',
        path: path.resolve(__dirname, '../public/')
    },
    plugins: [
        new VueSSRServerPlugin()
    ],
    externals: [nodeExternals({
        whitelist: /\.css$/
    })]
});
