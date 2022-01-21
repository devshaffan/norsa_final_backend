const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('amountPaid', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATE
        },
        ammount: {
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
