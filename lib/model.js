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

function connect(opts)
{
  const dsn = {
          database: opts.database
        , username: opts.username || null
        , password: opts.password || null
        }
  ;

  try {
    const sequelize = new Sequelize(dsn.database, dsn.username, dsn.password, _.omit(opts, _.keys(dsn)));
    return sequelize.authenticate().then(() => Promise.resolve(sequelize));
  }
  catch (err) {
    return Promise.reject(err);
  }
}

function load(dirname, load_each)
{
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

module.exports = (opts) => {
  opts = _.defaults(opts || {}, { logger: console.log });

  const dirname = opts.models || path.join(process.cwd(), 'models');

  return connect(_.omit(opts, 'models'))
  .then((sequelize) => {
    return load(dirname, (file) => {
      const model = sequelize.import(file);
      opts.logger(`[exprest4] models.${model.name} loaded.`);
    })
    .then(() => Promise.resolve(sequelize));
  });
};
