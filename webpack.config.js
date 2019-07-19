const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const buildPath = path.resolve(__dirname, process.env.BUILD_PATH || 'dist')

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        sasasak: './src/sasasak.js',
        app: './src/app.js',
    },
    output: {
        publicPath: process.env.PUBLIC_PATH || '',
        filename: 'js/[name].min.js',
        path: buildPath,
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ]
            },
        ],
    },
    performance: {
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js')
        },
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        contentBase: buildPath,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        new HtmlWebpackPlugin({
            title: 'Animation - SaSaSak',
            filename: path.join(buildPath, 'index.html'),
            template: 'public/index.html',
        }),
        new CopyPlugin([
            { from: 'public', to: buildPath },
        ]),
    ],
    stats: 'minimal',
}
