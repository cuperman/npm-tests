# NPM Tests

This is an demo of a unit testing strategy for NPM packages.

## Concept

Test exports, mock imports

## Example Package

I created a single NPM package that executes git commands.

```javascript
// push a git repo with javascript
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
  .catch((err, stderr) => {
    console.error('Uh oh, something went wrong');
    console.error(stderr);
  });
```

## Example Unit Tests

```javascript

const { expect } = require('chai');
const sinon = require('sinon');
const mockRequire= require('mock-require');

// The git module depends on child_process#exec to execute commands in a shell.
// So I'm going to mock the exec function to prevent the commands from running
// durning the tests, to control the behavior during the tests, and to
// capture information when it is called to use for assertions.
const mockExec = sinon.stub();
mockRequire('child_process', { exec: mockExec });

// Now when you load the git module, it will use the mocked version of child_process
const git = require('../src/git');

// Remember to reset the stats of the stubbed function after each test
afterEach(() => mockExec.reset());

// Then you can test the module, like usual
describe('git', () => {
  beforeEach(() => {
    // in this case, I want to give exec a default behavior
    // because the callbacks expect to be called
    mockExec.callsFake((command, callback) => {
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
