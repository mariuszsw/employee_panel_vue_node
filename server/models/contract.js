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

            startDate: {
                allowNull: false,
                type: DataTypes.DATEONLY
            },

            duration: {
                allowNull: false,
                type: DataTypes.INTEGER
            },

            leave: {
                allowNull: false,
                type: DataTypes.INTEGER
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'User',
                    key: 'id'
                }
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
