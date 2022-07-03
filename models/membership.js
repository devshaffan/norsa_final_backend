const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('membership', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        amount: {
            type: Sequelize.STRING(45)
        },
        remainingAmount: {
            type: Sequelize.STRING(45)
        },
        month: {
            type: Sequelize.DATEONLY
        },
        paymentType: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        clientFk: {
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