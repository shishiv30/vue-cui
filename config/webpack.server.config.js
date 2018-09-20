const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(baseConfig,{
    target: 'node',
    entry: ['./src/app.js'],
    output: {
        path: path.resolve(__dirname, '..', 'build'),
        filename: 'ssr.server.bundle.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new VueSSRServerPlugin()
    ],
    externals: [nodeExternals({
        whitelist: ['vue2-google-maps']
    })]
});
