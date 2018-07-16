/**
 * Created by Jackie.Wu on 2017/8/24.
 */
const path = require('path');
const ENV = process.env.npm_lifecycle_event;
const webpack = require('webpack');
const theme = require('../source/theme.json');
//const CommonsChunkPlugin = require("webpack/lib/optimize/SplitChunksPlugin");

module.exports = () => {
  const config = {};
  config.resolve = {
    alias: {
      node_modules: path.join(process.cwd(), 'node_modules'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
  };

  const jsRule = {
    test: /\.js$/,
    use: [
      { loader: 'babel-loader', options: { compact: false } },
    ],
  };

  const cssRule = {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
    ],
  };

  const lessRule = {
    test: /\.less$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      { loader: 'less-loader', options: { modifyVars: theme, javascriptEnabled: true } },
    ],
  };

  const fileLoaderOptions = {
    name: '[name].[hash].[ext]',
  };

  //if(ENV !== 'dev'){
  //    fileLoaderOptions.outputPath = '/images/';
  //    fileLoaderOptions.publicPath = 'http://www.dpfile.com/app/adam-pc-peon'
  //}

  const fileRule = {
    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
    use: [
      {
        loader: 'file-loader',
        options: fileLoaderOptions,
      },
    ],
    exclude: [
      require.resolve('antd-mobile').replace(/warn\.js$/, ''),
    ],
  };

  const svgSprite = {
    test: /\.(svg)$/i,
    use: [
      'svg-sprite-loader',
    ],
    include: [
      require.resolve('antd-mobile').replace(/warn\.js$/, ''),
    ],
  };
  config.module = {
    rules: [
      jsRule,
      cssRule,
      lessRule,
      fileRule,
      svgSprite,
    ],
  };

  config.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      name: './dist/vendor',
      minChunks: (module) => {
        if (module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
          return false;
        }
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV === 'dev' ? 'development': 'production')
      }
    })
    // extractLESS,
  ];
  //config.mode = 'production';

  return config;
};