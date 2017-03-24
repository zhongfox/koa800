'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let path = require('path');

let project;
let app;
let targetFeature;

describe('settings feature', function() {
  describe('setup ', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
      targetFeature = project.getFeature('settings');
    });

    it('should copy scaffold', function(done) {
      let scaffoldPaths = targetFeature.scaffold.map(scaffold => {
        return path.join(env.testScaffoldRoot, scaffold);
      });

      project.setup().then(function() {
        env.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
      });
    });

    afterEach(function() {
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
    });

  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('config/settings.local.js should be top priority', function() {
      expect(app.settings.testkey1).to.equal('testkey1 in config/environments/settings.local.js');
    });

    it('config/imago.local.js should be second priority', function() {
      expect(app.settings.testkey2).to.equal('testkey2 in config/imago.local.js');
    });

    it('config/environments/{app.env} should be third priority when development', function() {
      app.env = 'development';
      expect(app.settings.testkey3).to.equal('testkey3 in config/environments/development.js');
    });

    it('config/environments/{app.env} should be third priority when production', function() {
      app.env = 'production';
      require('../../../lib/required_features/settings').run(app); // 需要重新装载
      expect(app.settings.testkey3).to.equal('testkey3 in config/environments/production.js');
    });

    it('config/settings.js should be last priority', function() {
      expect(app.settings.testkey4).to.equal('testkey4 in config/settings.js');
    });
  });
});
