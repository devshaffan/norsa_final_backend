const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('paybackPeriod', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATE
        },
        amount: {
            type: Sequelize.STRING(45)

        },
        amountPaidByClient: {
            type: Sequelize.STRING(45)
        },
        issuanceHistory_Id: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        paidByDealer: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        amountPaidToDealer: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        remarks: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        dateDeposit: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        handledByUserId: {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          }
        }
    }, {
        timestamps: true,
    });
};
