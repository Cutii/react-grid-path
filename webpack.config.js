const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry : path.resolve(__dirname, 'lib', 'index.js'),
  output : {
    path : path.join(__dirname, 'dist'),
    filename : 'react-grid-path.js',
    library : 'react-grid-path',
    libraryTarget : 'umd',
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
  plugins : [
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
  ],
};
