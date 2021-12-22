const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('issuancehistory', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    Client_id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      references: {
        model: 'client',
        key: 'id'
      }
    },
    Merchants_id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      references: {
        model: 'merchants',
        key: 'id'
      }
    },
    Pincode: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    PaybackPeriod: {
      type: Sequelize.STRING(45),
      allowNull: false,
      references: {
        model: 'merchanttypediscount',
        key: 'id'
      }
    },
    DateTime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    Amount: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    AmountPaid: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    TypeOfReturnPayment: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    DateDeposit: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    NfcCard_id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      references: {
        model: 'nfccard',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'issuancehistory',
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
        name: 'fk_IssuanceHistory_Client1_idx',
        using: 'BTREE',
        fields: [
          { name: 'Client_id' },
        ]
      },
      {
        name: 'fk_IssuanceHistory_Merchants1_idx',
        using: 'BTREE',
        fields: [
          { name: 'Merchants_id' },
        ]
      },
      {
        name: 'fk_IssuanceHistory_MerchantTypeDiscount1_idx',
        using: 'BTREE',
        fields: [
          { name: 'PaybackPeriod' },
        ]
      },
      {
        name: 'fk_IssuanceHistory_NfcCard1_idx',
        using: 'BTREE',
        fields: [
          { name: 'NfcCard_id' },
        ]
      },
    ]
  }, {
    timestamps: true,
  });
};
