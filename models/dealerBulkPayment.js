const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('dealerBulkPayment', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        Dealer: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'client',
                key: 'id'
            }
        },
        Amount: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Remarks: {
            type: Sequelize.STRING(300),
            allowNull: true
        },
        Date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createdByUserId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },

    }, {
        sequelize,
        tableName: 'dealerBulkPayment',
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

