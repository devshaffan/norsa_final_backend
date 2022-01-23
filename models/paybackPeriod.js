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
        }
    }, {
        timestamps: true,
    });
};
