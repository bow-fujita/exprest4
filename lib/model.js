/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

const path = require('path')
    , fs = require('fs')
    , _ = require('underscore')
    , Sequelize = require('sequelize')
;

function createSequelize(dsn, opts)
{
  if (_.isString(dsn)) {
    return new Sequelize(dsn, opts);
  }

  if (!_.isObject(dsn)) {
    throw new Error('Invalid data source name');
  }

  return new Sequelize(dsn.database, dsn.username, dsn.password, opts);
}

function connect(dsn, opts)
{
  try {
    const sequelize = createSequelize(dsn, opts);
    return sequelize.authenticate().then(() => Promise.resolve(sequelize));
  }
  catch (err) {
    return Promise.reject(err);
  }
}

function load(dirname, load_each)
{
  if (!dirname) {
    dirname = path.join(process.cwd(), 'models');
  }

  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, files) => {
      if (err) {
        return reject(err);
      }

      files.forEach((name) => {
        load_each(path.join(dirname, name));
      });

      resolve();
    });
  });
}

module.exports = (dirname, dsn, opts) => {
  opts = _.defaults(opts || {}, {
           logger: console.log
         });

  return connect(dsn, opts)
  .then((sequelize) => {
    return load(dirname, (file) => {
      const model = sequelize.import(file);
      opts.logger(`[exprest4] models.${model.name} loaded.`);
    })
    .then(() => Promise.resolve(sequelize));
  });
};
