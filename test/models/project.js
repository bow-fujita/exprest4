/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = (sequelize, DataTypes, schema) => {
  return sequelize.define('project', {
    title: DataTypes.STRING
  , description: DataTypes.TEXT
  }, {
    schema: schema
  });
};
