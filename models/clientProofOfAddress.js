const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('clientProofOfAddress', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        Client_id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            references: {
                model: 'client',
                key: 'id'
            }
        },
        filePath: {
            type: Sequelize.STRING(500),
            allowNull: true
        },
        avatar: {
            type: Sequelize.STRING(500),
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'clientProofOfAddress',
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
                name: 'fk_clientProfilePicture_Client1_idx',
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
