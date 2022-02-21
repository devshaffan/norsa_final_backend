const Sequelize = require('sequelize');
module.exports = function (sequelize) {
  return sequelize.define('multipleIssueances', {
    id: {
        type: Sequelize.STRING(45),
        allowNull: false,
        primaryKey: true
    },
    issuancehistoryId:{
        type: Sequelize.STRING(45),
        references: {
            model: 'issuancehistory',
            key: 'id'
        }
    },
    merchantId: {
        type: Sequelize.STRING(45),
        references: {
            model: 'merchants',
            key: 'id'
        }
    },
    numberOfMonthsId: {
        type: Sequelize.STRING(45),
        references: {
            model: 'merchanttypediscount',
            key: 'id'
        }
    }
  });
};