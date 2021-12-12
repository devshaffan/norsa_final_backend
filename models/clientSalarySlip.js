const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('clientSalarySlip', {
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
        file1Path: {
            type: Sequelize.STRING(500),
            allowNull: true
        },
        file2Path: {
            type: Sequelize.STRING(500),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'clientSalarySlip',
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
