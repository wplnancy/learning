const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');
let downloadGitRepe = require('download-git-repo');
const util = require('util');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp');
const MetalSmith = require('metalsmith'); // 遍历文件夹 找需不需要渲染

const chalk = require("chalk")
const glob = require("glob")
const logSymbols = require('log-symbols')


// consolidate 统一了所有模板引擎
const {
  render,
} = require('consolidate').ejs;

function fatal(msg, stack) {
  console.error();
  console.error(chalk.red('  Metalsmith') + chalk.gray(' · ') + msg);
  if (stack) {
    console.error();
    console.error(chalk.gray(stack));
  }
  console.error();
  process.exit(1);
}

downloadGitRepe = util.promisify(downloadGitRepe);

const {
  downloadDirectory,
} = require('./constants');

// 获取项目列表
const fetchRepoList = async () => {
  const {
    data,
  } = await axios.get('https://api.github.com/orgs/zhu-cli/repos');
  return data;
};

// 封装 loading 效果
const waitFnLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
};

// 抓取tag列表
const fechTagList = async (repo) => {
  const {
    data,
  } = await axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`);
  return data;
};

const download = async (repo, tag) => {
  let api = `zhu-cli/${repo}`;

  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  await downloadGitRepe(api, dest);
  return dest; // 下载的最终目录
};

module.exports = async (program, projectName) => {
  const list = glob.sync('*')  // 遍历当前目录
  if(!projectName) {
    return program.help()
  }

  let rootName = path.basename(process.cwd())

  if (list.length) {  // 如果当前目录不为空
    if (list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join('.', name))
      const isDir = fs.statSync(fileName).isDirectory()
      return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
      console.log(`项目${projectName}已经存在`)
      return
    }
    rootName = projectName
  } else if (rootName === projectName) {
    rootName = '.'
  } else {
    rootName = projectName
  }
  
  let repos = await waitFnLoading(fetchRepoList, 'fetching template ....')();
  repos = repos.map((item) => item.name);

  // 选择模板
  const {
    repo,
  } = await Inquirer.prompt({
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos,
  });
  // 通过获取的项目获取对应的版本
  let tags = await waitFnLoading(fechTagList, 'fetching tags....')(repo);
  tags = tags.map((item) => item.name);

  const {
    tag,
  } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please chiis tags to create project',
    choices: tags,
  });

  console.log(tag);
  // 把模板放到一个临时目录里面， 存好  以备后期使用
  const result = await waitFnLoading(download, 'download template....')(repo, tag);

  if (!fs.existsSync(path.join(result, 'ask.js'))) {
    await ncp(result, path.resolve(rootName));
  } else {
    // 复杂的模板
    // 把 git 上的项目下载下来 如果有 ask 文件就是复杂的模板，  我们需要将用户选择填写到模板
    console.log(result);
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname)
        .source(result)
        .destination(path.resolve(rootName))
        .use(async (files, metal, done) => {
          console.log(files, metal, done);
          const args = require(path.join(result, 'ask.js'));
          const obj = await Inquirer.prompt(args);
          const meta = -metal.metadata;

          Object.assign(meta, obj);
          delete files['ask.js'];
          done();
        })
        .use((files, metal, done) => {
          const obj = metal.metadata();

          Reflect.ownKeys(files).forEach(async (file) => {
            if (file.includes('.js') || file.includes('.json')) {
              let content = files[file].contents.toString();
              if (content.includes('<%')) {
                content = await render(content, obj);
                files[file].contents = Buffer.from(content);
              }
            }
          });

          done();
        })
        .build((err) => {
          if (err) {
            // 失败了用红色，增强提示
            console.error(logSymbols.error, chalk.red(`创建失败：${error.message}`))
            reject();
          } else {
            // 成功用绿色显示，给出积极的反馈
            console.log(logSymbols.success, chalk.green('创建成功:)'))
            console.log()
            console.log(chalk.green('cd ' + rootName + '\nnpm install\nnpm run dev'))
            resolve();
          }
        });
    });
  }

  // 2) 用用户填写的信息去渲染模板
  // metalsmith 只要是模板编译 都需要这个模块

  console.log('下载目录', result);
};
