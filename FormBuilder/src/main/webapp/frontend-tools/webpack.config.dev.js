// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

/*
 import WebpackMd5Hash from 'webpack-md5-hash';
 */

console.log("path resolve is:" + path.resolve('../webapp'));

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  __DEV__:                true
};

export default {
  debug:   true,
  devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo:  true, // set to false to see a list of every file being bundled.
  entry:   ['./assets/js/main', './assets/styles/styles.scss'],
  target:  'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output:  {
    path:       './dist',
    publicPath: '/', // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a dynamically loaded CSS blob. Note: Only necessary in Dev.
    filename:   'bundle.js'
  },
  plugins: [
    // Optimize the order that items are bundled. This assures the hash is deterministic.
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
      _: 'underscore'
    }),
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].css'),
    // Eliminate duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin()
    // Minify JS
    /*
     new webpack.optimize.UglifyJsPlugin()
     */
  ],
  module:  {
    loaders: [
      {
        test:   /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:  {presets: ['es2015']}
      },
      /*Underscore templates */
      {
        test:                   /\.html$/,
        loader:                 'underscore-template-loader',
        prependFilenameComment: __dirname,
      },
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url?name=[name].[ext]'},
      {
        test:   /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url?limit=10000&mimetype=application/font-woff&name=[name].[ext]"
      },
      {test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'},
      {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'},
      {test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=[name].[ext]'},
      {test: /\.ico$/, loader: 'file?name=[name].[ext]'},
      {test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap']}
    ]
  },
  postcss: ()=> [autoprefixer]

};
