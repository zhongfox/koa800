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
    sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({eslint: true});
  });
  after(function() {
    helper.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup', function() {
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('eslint');
      targetFeature.gitHooksDir = fakeGitHooksDir;
    });

    it('.git/hooks/pre-commit should symbol link to bin/pre-commit', function(done) {
      project.setup().then(function() {
        require('fs').readlink(path.join(helper.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`), function(err, target) {
          if (err) return done(err);
          expect(target).to.equal(path.join(helper.koa800Root, 'bin/pre-commit'));
          done();
        });
      });
    });

    it('should contain devDependencies eslint', function(done) {
      project.setup().then(function() {
        let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
        let packageJson = require(packageJsonPath);
        expect(packageJson.devDependencies).to.have.property('eslint');
        done();
      });
    });

    afterEach(function() {
      project.teardownRequiredFeatures();
      require('rimraf').sync(path.join(helper.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`));
    });
  });
});
