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
    Pincode: {
      type: Sequelize.STRING(45),
      allowNull: false,
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
      allowNull: true,
      defaultValue: 0
    },
    Balance: {
      type: Sequelize.STRING(45),
      allowNull: true,
      defaultValue: 0
    },
    AmountDue: {
      type: Sequelize.STRING(45),
      defaultValue: 0
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
    },
    profitPercentage: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    profitAmount: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    tax: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    profitAfterTax: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    dealerCheck: {
      type: Sequelize.BOOLEAN,
      allowNull: true
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
