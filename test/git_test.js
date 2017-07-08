const { expect } = require('chai');
const sinon = require('sinon');
const mockRequire = require('mock-require');

const mockExec = sinon.stub();

mockRequire('child_process', {
  exec: mockExec
});

afterEach(() => mockExec.reset());

const git = require('../src/git');

describe('git', () => {
  beforeEach(() => {
    mockExec.callsFake((command, callback) => {
      callback(null);
    });
  });

  describe('#push()', () => {
    it('returns a Promise object', () => {
      let promise = git.push();
      expect(promise.constructor.name).to.equal('Promise');
    });

    it('executes command "git push"', (done) => {
      git.push()
        .then(() => {
          expect(mockExec.calledOnce).to.equal(true);
          expect(mockExec.calledWith('git push')).to.equal(true);
          done();
        })
        .catch((error) => done(error));
    });

    describe('with branch "master"', () => {
      it('executes command "git push origin master"', (done) => {
        git.push({ branch: 'master' })
          .then(() => {
            expect(mockExec.calledOnce).to.equal(true);
            expect(mockExec.calledWith('git push origin master')).to.equal(true);
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe('with branch "master" and remote "alt"', () => {
      it('executes command "git push alt master"', (done) => {
        git.push({ branch: 'master', remote: 'alt' })
          .then(() => {
            expect(mockExec.calledOnce).to.equal(true);
            expect(mockExec.calledWith('git push alt master')).to.equal(true);
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe('with force option', () => {
      it('executes command "git push --force"', (done) => {
        git.push({ force: true })
          .then(() => {
            expect(mockExec.calledOnce).to.equal(true);
            expect(mockExec.calledWith('git push --force')).to.equal(true);
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe('with all options', () => {
      it('executes command "git push --force alt master"', (done) => {
        git.push({ branch: 'master', remote: 'alt', force: true })
          .then(() => {
            expect(mockExec.calledOnce).to.equal(true);
            expect(mockExec.calledWith('git push --force alt master')).to.equal(true);
            done();
          })
          .catch((error) => done(error));
      });
    });
  });

  describe('#pull()', () => {
    beforeEach(() => {
      mockExec.callsFake((command, callback) => {
        callback(null);
      });
    });

    it('returns a Promise object', () => {
      let promise = git.pull();
      expect(promise.constructor.name).to.equal('Promise');
    });

    it('executes command "git pull"', (done) => {
      git.pull()
        .then(() => {
          expect(mockExec.calledOnce).to.equal(true);
          expect(mockExec.calledWith('git pull')).to.equal(true);
          done();
        })
        .catch((error) => done(error));
    });

    describe('with branch "master"', () => {
      it('executes command "git pull origin master"', (done) => {
        git.pull({ branch: 'master' })
          .then(() => {
            expect(mockExec.calledOnce).to.equal(true);
            expect(mockExec.calledWith('git pull origin master')).to.equal(true);
            done();
          })
          .catch((error) => done(error));
      });
    });

    describe('with branch "master" and remote "alt"', () => {
      it('executes command "git pull alt master"', (done) => {
        git.pull({ branch: 'master', remote: 'alt' })
          .then(() => {
            expect(mockExec.calledOnce).to.equal(true);
            expect(mockExec.calledWith('git pull alt master')).to.equal(true);
            done();
          })
          .catch((error) => done(error));
      });
    });
  });
});
