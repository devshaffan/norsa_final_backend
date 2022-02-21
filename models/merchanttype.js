const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('merchanttype', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    Title: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    interestOn: {
      type: Sequelize.STRING(45),
    }
  }, {
    sequelize,
    tableName: 'merchanttype',
    timestamps: false,
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
  }, {
    timestamps: true,
  });
};
