const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('transactionhistory', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    Client_id: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    Merchant_ID: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    ItemDescription: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    dateTime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    AmountUser: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    transactionType:{
      type: Sequelize.INTEGER,//1 means expense 2 retoure

    },
    issuancehistoryId: {
      type: Sequelize.STRING(45),
      references: {
        model: 'issuancehistory',
        key: 'id'
      }

    }
  }, {
    sequelize,
    tableName: 'transactionhistory',
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
        name: 'fk_TransactionHistory_Client1_idx',
        using: 'BTREE',
        fields: [
          { name: 'Client_id' },
        ]
      },
      // {
      //   name: 'fk_TransactionHistory_MerchantTypeDiscount1_idx',
      //   using: 'BTREE',
      //   fields: [
      //     { name: 'MerchantTypeDiscount_ID' },
      //   ]
      // },
    ]
  }, {
    timestamps: true,
  });
};
