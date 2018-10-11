/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const exprest = require(process.env.APP_ROOT)
    , path = require('path')
    , fs = require('fs')
    , _ = require('underscore')
    , model_dir = path.join(__dirname, '..', 'models')
;

describe('models', () => {

  describe('error', () => {

    it('no argument', (done) => {
      exprest.model()
      .should.be.rejectedWith(/Access denied/)
      .then(() => done(), done);
    });

    it('no dsn', (done) => {
      exprest.model({ models: model_dir })
      .should.be.rejectedWith(/Access denied/)
      .then(() => done(), done);
    });

    it('no models dir', (done) => {
      exprest.model({ dialect: 'sqlite' })
      .should.be.rejectedWith(/ENOENT/)
      .then(() => done(), done);
    });

    it('unknown dialect', (done) => {
      exprest.model({ dialect: 'unknown' })
      .should.be.rejectedWith(/not supported/)
      .then(() => done(), done);
    });

  }); // error

  describe('connect', () => {

    it('valid', (done) => {
      exprest.model.connect({
          database: process.env.EXPREST4_MYSQL_DB
        , username: process.env.EXPREST4_MYSQL_USER
        , password: process.env.EXPREST4_MYSQL_PASS
        , logging: console.log
      })
      .should.be.fulfilled()
      .then(() => done(), done);
    });

    it('invalid', (done) => {
      exprest.model.connect({
        database: process.env.EXPREST4_MYSQL_DB
      })
      .should.be.rejectedWith(/Access denied/)
      .then(() => done(), done);
    });

  }); // connect

  describe('sqlite', () => {

    const EXPREST4_SQLITE_DB = path.join(process.cwd(), 'test.sqlite')
        , options = {
            models: model_dir
          , dialect: 'sqlite'
          , storage: EXPREST4_SQLITE_DB
          , logging: console.log
          }
    ;

    after((done) => fs.unlink(EXPREST4_SQLITE_DB, done));

    it('sync', (done) => {
      exprest.model.sync(_.create(options, { force: true }))
      .then(done, done);
    });

    it('model', (done) => {
      exprest.model(options)
      .then((sequelize) => {
        const models = sequelize.models;
        models.should.have.property('project');

        return models.project.findAll()
        .then((rows) => {
          rows.should.be.an.Array;
          rows.should.be.empty();
        });
      })
      .then(done, done);
    });

  }); // sqlite

  describe('mysql', () => {

    const options = {
            models: model_dir
          , database: process.env.EXPREST4_MYSQL_DB
          , username: process.env.EXPREST4_MYSQL_USER
          , password: process.env.EXPREST4_MYSQL_PASS
          , logging: console.log
          }
    ;

    it('sync', (done) => {
      exprest.model.sync(_.create(options, { force: true }))
      .then(done, done);
    });

    it('model', (done) => {
      exprest.model(options)
      .then((sequelize) => {
        const models = sequelize.models;
        models.should.have.property('project');

        return models.project.findAll()
        .then((rows) => {
          rows.should.be.an.Array;
          rows.should.be.empty();
        });
      })
      .then(done, done);
    });

  }); // mysql

  describe('postgres', () => {

    const options = {
            models: model_dir
          , dialect: 'postgres'
          , database: process.env.EXPREST4_PGSQL_DB
          , username: process.env.EXPREST4_PGSQL_USER
          , password: process.env.EXPREST4_PGSQL_PASS
          , logging: console.log
          }
    ;

    it('sync', (done) => {
      exprest.model.sync(_.create(options, { force: true }))
      .then(done, done);
    });

    it('model', (done) => {
      exprest.model(options)
      .then((sequelize) => {
        const models = sequelize.models;
        models.should.have.property('project');

        return models.project.findAll()
        .then((rows) => {
          rows.should.be.an.Array;
          rows.should.be.empty();
        });
      })
      .then(done, done);
    });

    describe('schema', () => {

      const EXPREST4_PGSQL_SCHEMA = 'test';

      before((done) => {
        exprest.model.connect(options)
        .then((sequelize) => sequelize.createSchema(EXPREST4_PGSQL_SCHEMA, { logging: console.log }))
        .then(() => done(), done);
      });

      after((done) => {
        exprest.model.connect(options)
        .then((sequelize) => sequelize.dropSchema(EXPREST4_PGSQL_SCHEMA, { logging: console.log }))
        .then(() => done(), done);
      });

      it('sync', (done) => {
        exprest.model.sync(
          _.create(options, {
            schema: EXPREST4_PGSQL_SCHEMA
          , force: true
          })
        )
        .then(done, done);
      });

      it('model', (done) => {
        exprest.model(options)
        .then((sequelize) => {
          const models = sequelize.models;
          models.should.have.property('project');

          return models.project.schema(EXPREST4_PGSQL_SCHEMA).findAll()
          .then((rows) => {
            rows.should.be.an.Array;
            rows.should.be.empty();
          });
        })
        .then(done, done);
      });

    }); // schema

  }); // postgres

});
