const path = require('path')
const Happypack = require('happypack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'
const publicPath = isDev ? '/' : '/'

module.exports = {
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath,
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: path.resolve(__dirname, '../src/assets/svg'),
        options: {
          name: '[name]',
          prefixize: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(gif|svg)$/,
        loader: 'file-loader',
        exclude: path.resolve(__dirname, '../src/assets/svg'),
        options: {
          name: 'static/[name].[ext]?[hash:8]',
        },
      },
      {
        test: /\.(png|jpg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/',
          },
        }],
        include: [path.resolve(__dirname, '../src')],
      },
    ],
  },
  plugins: [
    new Happypack({
      id: 'js',
      threads: 4,
      loaders: ['babel-loader'],
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static'),
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static/status.html'),
        to: path.resolve(__dirname, '../dist/'),
      },
    ]),
    new webpack.ProvidePlugin({
      language: 'language',
    }),
  ],
}
