'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let helper = require('../../test_helper');
let path = require('path');
let fakeGitHooksDir = 'dotgit/hooks';

let project;
let targetFeature;

describe('eslint feature', function() {
  before(function() {
    sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({prepare_commit_msg: true});
  });
  after(function() {
    helper.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup', function() {
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('prepare_commit_msg');
      targetFeature.gitHooksDir = fakeGitHooksDir;
    });

    it('.git/hooks/prepare-commit-msg should symbol link to bin/prepare-commit-msg', function(done) {
      project.setup().then(function() {
        require('fs').readlink(path.join(helper.testScaffoldRoot, `${fakeGitHooksDir}/prepare-commit-msg`), function(err, target) {
          if (err) return done(err);
          expect(target).to.equal(path.join(helper.koa800Root, 'bin/prepare-commit-msg'));
          done();
        });
      });
    });

    afterEach(function() {
      project.teardownRequiredFeatures();
      require('rimraf').sync(path.join(helper.testScaffoldRoot, `${fakeGitHooksDir}/prepare-commit-msg`));
    });
  });
});
