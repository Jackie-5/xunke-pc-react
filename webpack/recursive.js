const fs = require('fs');
const path = require('path');
module.exports = () => {
  const pageConfig = {};
  fs.readdirSync(`${process.cwd()}/src/router-config`).forEach((item) => {
    const config = require(`../src/router-config/${item}`);
    for (let i in config) {
      pageConfig[i] = config[i];
    }
  });

  const entryFile = {};
  const copyFile = [];

  for (let i in pageConfig) {
    pageConfig[i].js.forEach((item) => {
      entryFile[`./build${i + item.split('.js')[0]}`] = `./src${i + item}`
    });
  }
  // 主文件
  return {
    pageConfig,
    entryFile,
    copyFile,
  }
};