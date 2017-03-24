'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let env = require('../../env');
let path = require('path');
let fakeGitHooksDir = 'dotgit/hooks';

let project;
let targetFeature;

describe('eslint feature', function() {
  before(function() {
    sinon.stub(env.Project.prototype, 'getKoa800Config').returns({eslint: true});
  });
  after(function() {
    env.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
      targetFeature = project.getFeature('eslint'); //TODO
      sinon.stub(env.Feature, 'gitHooksDir').returns(fakeGitHooksDir);
    });

    it('.git/hooks/pre-commit should symbol link to bin/pre-commit', function(done) {
      project.setup().then(function() {
        require('fs').readlink(path.join(env.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`), function(err, target) {
          if (err) return done(err);
          expect(target).to.equal(path.join(env.koa800Root, 'bin/pre-commit'));
          done();
        });
      });
    });

    it('should contain devDependencies eslint', function() {
      let packageJson = project.scaffoldGenerator.getPackageJson();
      expect(packageJson.devDependencies).to.have.property('eslint');
    });

    afterEach(function() { // TODO
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
      require('rimraf').sync(path.join(env.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`));
      env.Feature.gitHooksDir.restore();
    });
  });
});
