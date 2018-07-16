/**
 * Created by JackieWu on 16/4/20.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('./webpack-ejs-template');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const clone = require('clone');
const files = require('./recursive')();

// npm 指令
const ENV = process.env.npm_lifecycle_event;

const webpackConfig = require('./webpack-config')();
const webpackConfigClient = clone(webpackConfig);

webpackConfigClient.entry = files.entryFile;
webpackConfigClient.output = {
  filename: '[name].js',
};

const webpackEjs = ()=>{
  const pageConfig = require('../web-project.json');

  for (let i in pageConfig) {

    const obj = {
      template: './source/index.ejs',
      filename: ENV === 'dev' ? `${i}.html` :`./dist/${i}.html`,
      ejsObject:{
        title:pageConfig[i].title || '暂无标题'
      }
    };


    const arrJs = [];
    pageConfig[i].js.forEach((item) => {
      arrJs.push(`/dist${item}`)
    });
    obj.ejsObject.pathJs = arrJs;
    webpackConfigClient.plugins.push(
        new htmlWebpackPlugin(obj)
    );
  }
};


if (ENV === 'dev') {
  fs.writeFile('web-project.json', JSON.stringify(files.pageConfig, null, 2), () => {
    webpackEjs();
    webpackConfigClient.plugins.push(
        //new CopyWebpackPlugin([
        //  {
        //    from: './source/devtest/',
        //    to: './devtest'
        //  }
        //]),
        new ProgressBarPlugin()
    );
    const compiler = webpack(webpackConfigClient);

    const server = new WebpackDevServer(compiler, {
      inline: true,
      historyApiFallback: true,
      stats: { colors: true },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
      }
    });

    server.listen(3000, () => {
      console.log(`server start success, port 3000`);
    });

  });
}

if (ENV === 'build') {
  webpackEjs();
  webpackConfigClient.plugins.push(
      new UglifyJsPlugin()
  );
  const compiler = webpack(webpackConfigClient);
  compiler.run((err, stats) => {
    console.log(`compiler success`);
  });
}