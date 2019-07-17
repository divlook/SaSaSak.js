const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        'animation-paint': './src/animation-paint.js',
        'app': './src/app.js',
    },
    output: {
        publicPath: '',
        filename: 'js/[name].min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        port: 3000,
        hot: true,
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Animation - Paint',
            filename: path.resolve(__dirname, 'dist/index.html'),
        }),
    ],
    stats: 'minimal',
}
