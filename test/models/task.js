/*!
 * exprest4
 * Copyright (c) 2016-2018 Hiro Fujita <bow.fujita@gmail.com>
 * MIT License
 */

'use strict';

module.exports = (sequelize, DataTypes, schema) => {
  const model = sequelize.define('task', {
    title: DataTypes.STRING
  , description: DataTypes.TEXT
  }, {
    schema: schema
  });

  model.associate = function(models) {
    this.belongsTo(models.project, { as: 'project' });
  };

  return model;
};
