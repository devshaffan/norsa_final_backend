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
        issuanceHistoryFk:{
            type: Sequelize.STRING(45),
            references: {
                model: 'issuancehistory',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
    });
};