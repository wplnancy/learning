const program = require('commander');

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
      'zhu-li config set <k> <v></v>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};

// 监听用户的 help 事件
program.on('help', () => {
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
      console.log(action);
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
