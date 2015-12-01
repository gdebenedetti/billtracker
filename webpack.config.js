/**
 * Module Dependencies
 */

var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var merge = require('webpack-merge');

/**
 * Constants definition
 */

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

var common = {
  entry: PATHS.app,
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract('style', 'css'),
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: PATHS.app
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', __dirname],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    // important! move HotModuleReplacementPlugin below
    //new webpack.HotModuleReplacementPlugin(),
    new HtmlwebpackPlugin({
      title: 'Billtracker'
    }),
    new ExtractTextPlugin("style.css", {
      allChunks: true
    })
  ]
};

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // display only errors to reduce the amount of output
      stats: 'errors-only',

      // parse host and port from env so this is easy
      // to customize
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}