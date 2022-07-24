const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('merchantGroup', {
        id: {
            type: Sequelize.STRING(45),
            allowNull: false,
            primaryKey: true
        },
        merchantId: {
            type: Sequelize.STRING(45),
            references: {
                model: 'merchants',
                key: 'id'
            }
        },
        User_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
    });
};

