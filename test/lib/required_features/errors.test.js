'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let path = require('path');

describe('errors feature', function() {
  describe('#enhance', function() {
    let app = require(env.koa800Root)(env.testAppRoot);
    it('expect app.errors has 2 error class', function() {
      expect(app.errors).to.have.property('NetFTError');
      expect(app.errors).to.have.property('NotFoundError');
    });

    it('expect all app.errors are inherit from Error ', function() {
      expect(app.errors.NetFTError.super_).to.equal(Error);
      expect(app.errors.NotFoundError.super_).to.equal(Error);
    });
  });

  describe('#scaffold', function() {
    it('should copy scaffold', function(done) {
      let scaffold = [
        'config/errors.js',
      ];
      let scaffoldPaths = scaffold.map(scaffold => {
        return path.join(env.testScaffoldRoot, scaffold);
      });

      env.Feature.makeScaffold(env.testScaffoldRoot).then(function() {
        env.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
      });
    });

    after(function() { // TODO
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'config/errors.js'));
    });
  });
});
