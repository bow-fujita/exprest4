/*!
 * exprest4
 * Copyright (c) 2016 Hiromitsu Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = (sequelize, DataTypes, schema) => {
  return sequelize.define('task', {
    title: DataTypes.STRING
  , description: DataTypes.TEXT
  }, {
    schema: schema
  , classMethods: {
      associate: function(models) {
        this.belongsTo(models.project, { as: 'project' });
      }
    }
  });
};
