// This file configures the local development web server.
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.development';
/* eslint-disable no-console */

const port = 5000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  // Dev middleware can't access config, so we provide publicPath
  publicPath: config.output.publicPath,

  // These settings suppress noisy webpack output so only errors are displayed to the console.
  noInfo: false,
  quiet:  false,
  stats:  {
    assets:       false,
    colors:       true,
    version:      false,
    hash:         false,
    timings:      false,
    chunks:       false,
    chunkModules: false
  }
}));

/*app.get('*', function(req, res) {
 res.sendFile(path.join( __dirname, '../index.jsp'));
 });*/

app.use(express.static(__dirname + '/'));

const listener = app.listen(port, function(err){
  if(err){
    console.log(err);
  }
});

const address = listener.address();
const host = address.address;
console.log('Webpack Dev Server running at http://' + host + ':' + address.port);
