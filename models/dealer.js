const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('dealer', {
    id: {
      type: Sequelize.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    Code: {
      type: Sequelize.STRING(45),
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
    Status: {
      type: Sequelize.BOOLEAN,
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
    NoOfIssuedCards: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    MaxBorrowAmount: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    Group: {
      type: Sequelize.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dealer',
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
