const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('insurance', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        amount: {
            type: Sequelize.STRING(45)
        },
        tax:{
            type: Sequelize.STRING(45)
        },
        paymentType: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        issuanceHistoryFk:{
            type: Sequelize.STRING(45),
            references: {
                model: 'issuancehistory',
                key: 'id'
            }
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