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
    , db_file = path.join(__dirname, '..', 'database.sqlite')
;

describe('sqlite', () => {

  describe('dsn', () => {

    it('string', (done) => {
      exprest.model(model_dir, 'sqlite:')
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
      exprest.model(model_dir, {}, { dialect: 'sqlite' })
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

  }); // model

});
