/*This Config is meant for an unminified build and sets React to use development mode */
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import autoprefixer from 'autoprefixer';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  __DEV__:                true
};

export default {
  debug:   true,
  devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo:  true, // set to false to see a list of every file being bundled.
  /*entry point to main JS and CSS file */
  entry:   ['./assets/js/main', './assets/styles/styles.scss'],
  target:  'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output:  {
    path:       path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/', // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a dynamically loaded CSS blob. Note: Only necessary in Dev.
    filename:   'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist')
  },
  plugins: [
    // Optimize the order that items are bundled. This assures the hash is deterministic.
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
      /*make _ globally available. TODO consider undoing this and explicitly importing _. into modules that use it */
      _: 'underscore'
    }),
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    new ExtractTextPlugin('style.css'),
    // Eliminate duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin()
  ],
  module:  {
    loaders: [
      {
        test:   /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        /* use these presets (specified in .babelrc */
        query:  {presets: ['es2015', 'react']}
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
      {test: /(\.css|\.scss)$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap!postcss')}
    ]
  },
  /*used to add CSS vendor prefixes on SCSS transpilation to CSS rather than adding them manually in the SCSS source */
  postcss: ()=> [autoprefixer]
};
