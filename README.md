# NPM Tests

This is an demo of a unit testing strategy for NPM packages.

## Concept

Test exports, mock imports

## Example Code

I needed something to test, so I created a node module that executes git commands.

```javascript
// git.js

// use child_process::exec to execute shell commands
// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
const { exec } = require('child_process');

// a private method to execute git commands with variable arguments
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
    // populate args from options
    // ...
    return execGit('push', args);
  },

  pull: (options = {}) => {
    let args = [];
    // populate args from options
    // ...
    return execGit('push', args);
  }
};

// export git methods as public functions
module.exports = git;
```

## Example Usage

Here are some simple examples of how to use the module by executing javascript functions.

```javascript
// push a git repo
git.push();
// => spawns a shell and executes 'git push'

// and it supports options
git.push({ branch: 'master', force: true });
// => executes 'git push --force origin master'

// it also works with pull
git.pull();
// => executes 'git pull'

// all commands return a promise
git.push()
  .catch((err) => {
    console.error('Uh oh, something went wrong');
    console.error(err.message);
  });
```


## Example Unit Tests

For the unit tests, I'm using mocha/chai for framework and asserts, sinon for spies and stubs, and mock-require to mock dependencies (things that are required by the module I'm testing).

The key here is using mock-require before requiring the module in your tests, stubbing the behavior of the dependent module to control scenarios, and using spies to test that your code is doing the right things.  You can apply this same technique to different frameworks and test libraries.

```javascript
// git_test.js

const { expect } = require('chai');
const sinon = require('sinon');
const mockRequire= require('mock-require');

// Since the git module depends on child_process::exec to execute commands,
// so I'm going to mock the exec function to prevent the commands from running
// durning the tests, to control the behavior during the tests,
// and to use information about when and how it is called for assertions.
const mockExec = sinon.stub();
mockRequire('child_process', { exec: mockExec });

// Now the git module will use the mocked version of child_process when it loads
// because we used mock-require.
const git = require('../src/git');

// Remember to reset the stats of the stubbed function after each test
afterEach(() => mockExec.reset());

// Then you can test the module, like usual
describe('git', () => {
  beforeEach(() => {
    // in this case, I want to give exec a default behavior
    // because the callbacks expect to be called
    mockExec.callsFake((command, callback) => {
      // null for the first argument means success
      callback(null);
    });
  });

  describe('#push()', () => {
    it('executes command "git push"', (done) => {
      // Since the method is a stub, you have access to statistics about how it was called
      // which can be really handy for assertions
      expect(mockExec.calledOnce).to.be.true;
      expect(mockExec.calledWith('git push')).to.be.true;
      done();
    });
  });

  // and you can test error conditions by changing how the mocked exec function calls the callback
  describe('on error', () => {
    beforeEach(() => {
      mockExec.callsFake((command, callback) => {
        // an error object for the first argument means it failed
        callback({ message: 'Failed to push repo' });
      });
    });

    it('calls callback with an error object', (done) => {
      git.push()
        .then(() => {
          throw new Error('the push command should not succeed');
        }, (error) => {
          expect(error.message).to.equal('Failed to push repo');
          done();
        });
    });
  });
});
```
