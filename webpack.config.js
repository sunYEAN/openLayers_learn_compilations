const path = require('path');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "vendor.js"
    },
    resolve: {
        extensions: ['.js', '.css', '.ts']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [
                    /node_modules/,
                    path.resolve(__dirname, 'lib')
                ]
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    devServer: {
        host: '0.0.0.0'
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new WebpackHtmlPlugin({
            template: path.resolve(__dirname, './index.html')
        })
    ]
}