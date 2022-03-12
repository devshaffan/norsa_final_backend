const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('task', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    task: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'task',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ]
      },
    ]
  });
};
