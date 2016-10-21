/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , path = require('path')
    , fs = require('fs')
    , model_dir = path.join(__dirname, '..', 'models')
;

describe('models', () => {

  describe('error', () => {

    it('no argument', (done) => {
      exprest.model()
      .should.be.rejectedWith(/ER_ACCESS_DENIED_ERROR/)
      .then(() => { done(); }, done);
    });

    it('no dsn', (done) => {
      exprest.model({ models: model_dir })
      .should.be.rejectedWith(/ER_ACCESS_DENIED_ERROR/)
      .then(() => { done(); }, done);
    });

    it('no models dir', (done) => {
      exprest.model({ dialect: 'sqlite' })
      .should.be.rejectedWith(/ENOENT/)
      .then(() => { done(); }, done);
    });

    it('unknown dialect', (done) => {
      exprest.model({ dialect: 'unknown' })
      .should.be.rejectedWith(/not supported/)
      .then(() => { done(); }, done);
    });

  }); // error

  it('sqlite', (done) => {
    exprest.model({
      models: model_dir
    , dialect: 'sqlite'
    })
    .then((sequelize) => {
      sequelize.models.should.have.property('project');
      return sequelize.models.project.sync();
    })
    .then((project) => {
      return project.findAll()
      .then((rows) => {
        rows.should.be.an.Array;
        rows.should.be.empty();
      });
    })
    .then(done, done);
  });

  it('mysql', (done) => {
    exprest.model({
      models: model_dir
    , database: process.env.EXPREST4_MYSQL_DB
    , username: process.env.EXPREST4_MYSQL_USER
    , password: process.env.EXPREST4_MYSQL_PASS
    })
    .then((sequelize) => {
      sequelize.models.should.have.property('project');
      return sequelize.models.project.sync();
    })
    .then((project) => {
      return project.findAll()
      .then((rows) => {
        rows.should.be.an.Array;
        rows.should.be.empty();
      });
    })
    .then(done, done);
  });

  it('postgres', (done) => {
    exprest.model({
      models: model_dir
    , database: process.env.EXPREST4_PGSQL_DB
    , username: process.env.EXPREST4_PGSQL_USER
    , password: process.env.EXPREST4_PGSQL_PASS
    , dialect: 'postgres'
    })
    .then((sequelize) => {
      sequelize.models.should.have.property('project');
      return sequelize.models.project.sync();
    })
    .then((project) => {
      return project.findAll()
      .then((rows) => {
        rows.should.be.an.Array;
        rows.should.be.empty();
      });
    })
    .then(done, done);
  });

});
