const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('group', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        Code: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        Client_id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            references: {
                model: 'client',
                key: 'id'
            }
        },
    }, {
        sequelize,
        tableName: 'group',
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
            {
                name: 'fk_group_Client1_idx',
                using: 'BTREE',
                fields: [
                    { name: 'Client_id' },
                ]
            }
        ]
    }, {
        timestamps: true,
    });
};
