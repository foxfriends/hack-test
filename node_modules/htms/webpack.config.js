'use strict';
const webpack = require('webpack');
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('./dist/'),
    publicPath: 'dist/',
    filename: 'htms.min.js'
  },
  module: {
    rules: [
      { test: /.*\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};
