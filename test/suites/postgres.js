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
    , PGSQL_DB = process.env.EXPREST4_PGSQL_DB
    , PGSQL_USER = process.env.EXPREST4_PGSQL_USER
    , PGSQL_PASS = process.env.EXPREST4_PGSQL_PASS
;

describe('postgres', () => {

  it('url', (done) => {
    let credentials = PGSQL_USER;
    if (PGSQL_PASS) {
      credentials += `:${PGSQL_PASS}`;
    }

    exprest.model(model_dir, `postgres://${credentials}@localhost/${PGSQL_DB}`)
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

  it('object', (done) => {
    exprest.model(model_dir, {
      database: PGSQL_DB
    , username: PGSQL_USER || null
    , password: PGSQL_PASS || null
    }, {
      dialect: 'postgres'
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
