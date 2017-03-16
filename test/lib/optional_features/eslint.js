'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let env = require('../../env');
let path = require('path');

describe('eslint feature', function() {
  describe('packageJson', function() {
    it('should contain dependencies koa-safe-jsonp', function() {
      let Feature = env.Feature;
      Feature.setRoot(env.testScaffoldRoot);
      let packageJson = Feature.getPackageJson();
      expect(packageJson.devDependencies).to.have.property('eslint');
      // TODO
    });
  });

  describe('#update', function() {
    let fakeGitHooksDir = 'dotgit/hooks';
    it('.git/hooks/pre-commit should symbol link to bin/pre-commit', sinon.test(function(done) {
      let eslintFeature = require(path.join(env.koa800Root, 'lib/optional_features/eslint.js'));
      this.stub(env.Feature, 'getUpdate').returns({eslint: eslintFeature.update});
      this.stub(env.Feature, 'gitHooksDir').returns(fakeGitHooksDir);

      env.Feature.makeScaffold(env.testScaffoldRoot).then(function() {
        require('fs').readlink(path.join(env.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`), function(err, target) {
          if (err) return done(err);
          expect(target).to.equal(path.join(env.koa800Root, 'bin/pre-commit'));
          done();
        });
      });
    }));

    after(function() { // TODO
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'app'));
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'config'));
      require('fs').unlinkSync(path.join(env.testScaffoldRoot, `${fakeGitHooksDir}/pre-commit`));
    });
  });
});
