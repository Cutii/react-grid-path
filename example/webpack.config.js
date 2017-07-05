const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = process.env.PORT || 4003;
const isProd = process.env.NODE_ENV === 'production';

const plugins = (isProd
  ? [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap : false,
      beautify : false,
      mangle : {
        screw_ie8 : true,
        keep_fnames : true,
      },
      compress : {
        screw_ie8 : true,
      },
      comments : false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify('production'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize : true,
      debug : false,
    }),
  ]
  : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify('development'),
    }),
  ]).concat([
  // Inject bundle in index.html
    new HtmlWebpackPlugin({
      template : path.join(__dirname, 'src', 'index.html'),
      filename : '../index.html',
    }),
  ]);

module.exports = {
  entry : path.resolve(__dirname, 'src', 'index.js'),
  output : {
    path : path.join(__dirname, 'dist'),
    filename : isProd ? 'bundle.js' : 'dist/bundle.js',
  },
  devServer : {
    contentBase : path.join(__dirname),
    compress : true,
    port : PORT,
  },
  module : {
    rules : [
      {
        test : /\.js$/,
        loader : 'babel-loader',
        exclude : /node_modules/,
      },
    ],
  },
  plugins,
};
