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
        status: {
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
        dateDeposit: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        handledBy : {
            type: Sequelize.STRING(45),
            references: {
                model: 'client',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
    });
};
