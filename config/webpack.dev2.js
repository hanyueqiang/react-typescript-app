const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlVersionPlugin = require('html-commit-version-plugin')
const apiMocker = require('webpack-api-mocker')
const baseConfig = require('./webpack.config.base')

const jsonStringify = v => JSON.stringify(v)
const copyFile = (type) => {
  fs.writeFileSync(path.resolve(__dirname, '../src/config/index.js'), fs.readFileSync(path.resolve(__dirname, `../src/config/${type}.js`)))
}
const isDev = process.env.NODE_ENV === 'development'
if (!isDev) copyFile(process.env.NODE_ENV)

const devServer = {
  host: '0.0.0.0',
  port: '8001',
  hot: true,
  historyApiFallback: true,
  overlay: {
    errors: true,
  },
  publicPath: '/',
  proxy: {
    '/api': {
      target: 'http://1.2.3.4:8080/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    },
  },
  before(app) {
    apiMocker(app, path.resolve('./mocker/index.js'), {
      changeHost: true,
    })
  },
}
const defaultPlugins = [
  new HtmlWebpackPlugin({
    hash: true,
    filename: 'index.html',
    template: path.resolve(__dirname, '../src/index.html'),
  }),
]
let config

if (isDev) {
  config = merge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    devServer,
    entry: {
      index: [
        'react-hot-loader/patch',
        path.resolve(__dirname, '../src/index.js'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [{
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              module: true,
              localIdentName: '[local]__[hash:8]',
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
          ],
        },
        {
          test: /\.less$/,
          include: /node_modules/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
            },
            { loader: 'postcss-loader' },
            {
              loader: require.resolve('less-loader'),
              options: {
                modifyVars: {
                  'primary-color': '#1AAF92', // 全局主色
                },
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
    ]),
  })
} else {
  config = merge(baseConfig, {
    mode: 'production',
    entry: [path.resolve(__dirname, '../src/index.js')],
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: {
        name: 'runtime',
      },
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1, minimize: true, module: true },
            },
            { loader: 'postcss-loader' },
            { loader: 'less-loader' },
          ],
        },
        {
          test: /\.less$/,
          include: /node_modules/,
          use: [{
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#1AAF92',
              },
            },
          },
          ],
        },
        {
          test: /\.css$/,
          include: [path.resolve(__dirname, '../src')],
          use: [
            'style-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: defaultPlugins.concat([
      new HtmlVersionPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css',
        chunkFilename: '[name].[contenthash:8].css',
      }),
    ]),
  })
}
module.exports = config
