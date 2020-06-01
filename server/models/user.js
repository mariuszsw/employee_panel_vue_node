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
    const User = sequelize.define(
        'User',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING
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
            hooks: {
                beforeSave: hashPassword
            }
        }
    );
    User.associate = function (models) {};

    User.prototype.comparePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
};
