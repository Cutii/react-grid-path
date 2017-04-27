const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = process.env.PORT || 4003;

module.exports = {
  entry   : path.resolve(__dirname, 'index.js'),
  output  : {
    path     : path.join(__dirname, 'dist'),
    filename : 'bundle',
  },
  devServer : {
    contentBase : path.join(__dirname, 'dist'),
    compress    : true,
    port        : PORT,
  },
  module : {
    rules : [
      {
        test    : /\.js$/,
        loader  : 'babel-loader',
        exclude : /node_modules/,
      },
    ],
  },
  plugins : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify('development'),
    }),
    // Inject bundle in index.html
    new HtmlWebpackPlugin({
      template : path.join(__dirname, 'index.html'),
    }),
  ],
};
