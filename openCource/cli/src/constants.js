// 存放常量

const pkg = require('../package.json');

const downloadDirectory = `${process.env[process.platform == 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

module.exports = {
  version: pkg.version,
  downloadDirectory,
};
