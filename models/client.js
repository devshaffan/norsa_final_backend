const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('client', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    Code: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    Date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    ExpiryDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    FirstName: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    LastName: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    idCard: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    Status: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    ChildrenCount: {
      type: Sequelize.INTEGER, // 0 means no children 1 means have 1 child and so on
      allowNull: false
    },
    Email: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    ContactNo: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    WorkNo: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    WorksAt: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    FaxNumber: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    Partner: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    Housing: {     // 0 for own house, 1 for living at parents, 2 for renting a house 
      type: Sequelize.INTEGER,
      allowNull: false
    },
    NameOfPartner: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    address : {
      type : Sequelize.STRING(500),
      allowNull : true
    },
    Remarks : {
      type : Sequelize.STRING(500),
      allowNull : true
    },
    MaxBorrowAmount: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Dealer_id: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    SourceOfIncome: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    RecievedCreditInPast: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'client',
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
