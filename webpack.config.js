const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        sasasak: './src/sasasak.js',
        app: './src/app.js',
    },
    output: {
        publicPath: '',
        filename: 'js/[name].min.js',
        path: path.resolve(__dirname, 'docs'),
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        contentBase: path.join(__dirname, 'docs'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Animation - SaSaSak',
            filename: path.resolve(__dirname, 'docs/index.html'),
            template: 'src/index.html',
        }),
    ],
    stats: 'minimal',
}
