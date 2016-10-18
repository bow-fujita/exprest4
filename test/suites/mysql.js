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
    , MYSQL_DB = process.env.EXPREST4_MYSQL_DB
    , MYSQL_USER = process.env.EXPREST4_MYSQL_USER
;

describe('mysql', () => {

  it('url', (done) => {
    exprest.model(model_dir, `mysql://${MYSQL_USER}@localhost/${MYSQL_DB}`)
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
    exprest.model(model_dir, { database: MYSQL_DB, username: MYSQL_USER })
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
