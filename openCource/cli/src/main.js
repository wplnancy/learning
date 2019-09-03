const program = require('commander');
const path = require('path');

const {
  version,
} = require('./constants');

const mapAction = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'zhu-li create <projectName>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'config a project',
    examples: [
      'zhu-li config set <k> <v>',
      'zhu-li config get <k>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};

// 监听用户的 help 事件 解析例子
program.on('--help', () => {
  console.log('Example...');
  Reflect.ownKeys(mapAction).forEach((action) => {
    mapAction[action].examples.forEach((example) => {
      console.log(`${example}`);
    });
  });
});

Reflect.ownKeys(mapAction).forEach((action) => {
  program.command(action).alias(mapAction[action].alias).description(mapAction[action].description).action(() => {
    if (action == '*') {
      console.log('command not found');
    } else {
      // console.log(action); // create
      // 执行命令 zhu-cli create projectName
      require(path.resolve(__dirname, action))(...process.argv.slice(3));
    }
  });
});


// program
//   .version('0.1.0')
//   .command('rmdir <dir> [otherDirs...]')
//   .action((dir, otherDirs) => {
//     console.log('rmdir %s', dir);
//     if (otherDirs) {
//       otherDirs.forEach((oDir) => {
//         console.log('rmdir %s', oDir);
//       });
//     }
//   });

// 解析用户传递过来的参参数
program.parse(process.argv);
