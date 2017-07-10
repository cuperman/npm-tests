const { exec } = require('child_process');

const execGit = (command, args = []) => {
  return new Promise((resolve, reject) => {
    const shellCommand = ['git', command].concat(args).join(' ');
    exec(shellCommand, (error, stdout,  stderr) => {
      if (error) {
        return reject(error);
      }
      return resolve(stdout);
    });
  });
};

const git = {
  push: (options = {}) => {
    let args = [];

    if (options.force) {
      args.push('--force');
    }

    if (options.branch) {
      args.push(options.remote ? options.remote : 'origin');
      args.push(options.branch);
    }

    return execGit('push', args);
  },

  pull: (options = {}) => {
    let args = [];

    if (options.branch) {
      args.push(options.remote ? options.remote : 'origin');
      args.push(options.branch);
    }

    return execGit('pull', args);
  }
};

module.exports = git;
