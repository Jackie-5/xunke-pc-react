const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const clone = require('clone');

function WebpackEjsTemplate(options) {
  this.options = clone(options);
}

WebpackEjsTemplate.prototype.apply = function (compiler) {
  const self = this;
  this.options.template = path.resolve(compiler.context, this.options.template);
  compiler.plugin("emit", function (compilation, callback) {
    const content = ejs.render(fs.readFileSync(self.options.template, 'utf-8'), self.options.ejsObject);
    compilation.assets[self.options.filename] = {
      source: () => content,
      size: () => content.length
    };

    return callback();

  });
};

module.exports = WebpackEjsTemplate;