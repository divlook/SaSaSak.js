const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        sasasak: './src/sasasak.js',
        app: './src/app.js',
    },
    output: {
        publicPath: process.env.PUBLIC_PATH || '',
        filename: 'js/[name].min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
        contentBase: path.join(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Animation - SaSaSak',
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: 'src/index.html',
        }),
    ],
    stats: 'minimal',
}
