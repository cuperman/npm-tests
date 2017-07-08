const { exec } = require('child_process');

const execGitCommand = (command, args = []) => {
  return new Promise((resolve, reject) => {
    const shellCommand = [].concat('git', command, args).join(' ');
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

    return execGitCommand('push', args);
  },

  pull: (options = {}) => {
    let args = [];

    if (options.branch) {
      args.push(options.remote ? options.remote : 'origin');
      args.push(options.branch);
    }

    return execGitCommand('pull', args);
  }
};

module.exports = git;
