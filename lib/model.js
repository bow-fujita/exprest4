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
  opts = opts || {};
  opts.dialect = opts.dialect || 'mysql';

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

function load(opts, load_each)
{
  opts = opts || {};

  const dirname = opts.models || path.join(process.cwd(), 'models')
      , logging = opts.logging || console.log
  ;

  return connect(_.omit(opts, 'models'))
  .then((sequelize) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dirname, (err, files) => {
        if (err) {
          return reject(err);
        }

        files.forEach((name) => {
          load_each(path.join(dirname, name), sequelize, logging);
        });

        const models = sequelize.models;
        _.keys(models).forEach((name) => {
          const model = models[name];
          if (_.isFunction(model.associate)) {
            model.associate(models);
          }
        });

        resolve(sequelize);
      });
    });
  });
}

module.exports = (opts) => {
  return load(opts, (file, sequelize, logging) => {
    const model = sequelize.import(file);
    logging(`[exprest4] models.${model.name} loaded.`);
  });
};

module.exports.sync = (opts) => {
  return load(opts, (file, sequelize) => {
    const define = require(file);
    define(sequelize, Sequelize, opts.schema);
  })
  .then((sequelize) => {
    return sequelize.sync(opts).then(() => Promise.resolve())
  });
};

module.exports.connect = connect;
