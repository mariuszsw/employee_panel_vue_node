'use strict';
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

function hashPassword(user, options) {
    const SALT = 8;
    if (!user.changed('password')) {
        return;
    }

    return bcrypt
        .genSaltAsync(SALT)
        .then((salt) => bcrypt.hashSync(user.password, salt))
        .then((hash) => {
            user.setDataValue('password', hash);
        });
}

module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define(
        'Contract',
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },

            name: {
                allowNull: false,
                type: DataTypes.STRING
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'User',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        },
        {
            defaultScope: {
                attributes: { exclude: ['password'] }
            },
            hooks: {
                beforeSave: hashPassword
            }
        }
    );

    Contract.associate = function (models) {
        Contract.belongsTo(models.User, {
            as: 'user'
        });
    };

    return Contract;
};
