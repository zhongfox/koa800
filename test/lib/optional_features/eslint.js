'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let env = require('../../env');
let path = require('path');
let fakeGitHooksDir = 'dotgit/hooks';

describe('eslint feature', function() {
  beforeEach(function() {
    env.Feature.features = null; // 重新加载
    env.Feature.optional = {eslint: true};
  });

  describe('make_scaffold ', function() {
    let scaffoldMaker;
    beforeEach(function() {
      scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);

      // only for update
      let eslintFeature = require(path.join(env.koa800Root, 'lib/optional_features/eslint.js'));
      sinon.stub(scaffoldMaker, 'getUpdate').returns({eslint: eslintFeature.update(env.testScaffoldRoot)});
      sinon.stub(env.Feature, 'gitHooksDir').returns(fakeGitHooksDir);
    });

    it('should contain devDependencies eslint', function() {
      let packageJson = scaffoldMaker.getPackageJson();
      expect(packageJson.devDependencies).to.have.property('eslint');
      // TODO
    });

    it('.git/hooks/pre-commit should symbol link to bin/pre-commit', function(done) {
      scaffoldMaker.make().then(function() {
        require('fs').readlink(path.join(env.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`), function(err, target) {
          if (err) return done(err);
          expect(target).to.equal(path.join(env.koa800Root, 'bin/pre-commit'));
          done();
        });
      });
    });

    afterEach(function() { // TODO
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'app'));
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'config'));
      require('rimraf').sync(path.join(env.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`));
      scaffoldMaker.getUpdate.restore();
      env.Feature.gitHooksDir.restore();
    });
  });
});
