const fs = require('fs');
module.exports = () => {
  const pageConfig = {};
  fs.readdirSync(`${process.cwd()}/source/router-config`).forEach((item) => {
    const config = require(`../source/router-config/${item}`);
    for (let i in config) {
      pageConfig[i] = config[i];
    }
  });

  const entryFile = {};

  for (let i in pageConfig) {
    pageConfig[i].js.forEach((item) => {
      entryFile[`./dist${item.split('.js')[0]}`] = `./source${item}`
    });
  }
  // 主文件
  return {
    pageConfig,
    entryFile,
  }
};
