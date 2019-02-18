const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isDev = process.env.WEBPACK_MODE === 'production';
const sourcePath = path.resolve(__dirname, '../src/');
module.exports = {
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': sourcePath
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.(woff2?|svg|ttf|eot)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }, {
            test: /\.(png|jpe?g|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
            }, {
                loader: 'image-webpack-loader',
                options: {
                    bypassOnDebug: true
                }
            }]
        }, {
            test: /\.scss$/,
            use: [  
                isDev ? 'vue-style-loader'  : MiniCssExtractPlugin.loader,
                'css-loader', 
                'sass-loader'
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/app.template.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ]
};