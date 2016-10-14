/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('project', {
    title: DataTypes.STRING
  , description: DataTypes.TEXT
  });
};
