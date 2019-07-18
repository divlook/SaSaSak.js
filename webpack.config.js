const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        contentBase: buildPath,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Animation - SaSaSak',
            filename: path.join(buildPath, 'index.html'),
            template: 'src/index.html',
        }),
    ],
    stats: 'minimal',
}
