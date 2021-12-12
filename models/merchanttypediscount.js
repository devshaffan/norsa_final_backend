const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('merchanttypediscount', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    NumberOfMonths: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    Interest: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    MerchantType_id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      references: {
        model: 'merchanttype',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'merchanttypediscount',
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
      {
        name: 'fk_MerchantTypeDiscount_MerchantType1_idx',
        using: 'BTREE',
        fields: [
          { name: 'MerchantType_id' },
        ]
      },
    ]
  }, {
    timestamps: true,
  });
};
