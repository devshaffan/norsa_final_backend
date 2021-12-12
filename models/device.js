const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('device', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    nameNumber: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    batteryStatus: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'device',
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
