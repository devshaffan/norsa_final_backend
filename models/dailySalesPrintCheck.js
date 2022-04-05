const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('dailysalesprintcheck', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        status: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        datePrinted: {
            type: Sequelize.DATE,
            allowNull: true
        },
        merchantId: {
            type: Sequelize.STRING(45),
            references: {
                model: 'merchants',
                key: 'id'
            }
        }
    }, {
        sequelize,
        tableName: 'dailysalesprintcheck',
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