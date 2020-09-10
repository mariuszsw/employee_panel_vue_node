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
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },

            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
            surname: {
                allowNull: false,
                type: DataTypes.STRING
            },
            birthdate: {
                allowNull: false,
                type: DataTypes.DATEONLY
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING
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

    User.associate = function (models) {
        User.belongsToMany(models.Role, {
            as: 'roles',
            through: 'UserRoles',
            foreignKey: 'userId',
            otherKey: 'roleId'
        });
    };

    User.prototype.comparePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    User.prototype.isAdmin = async function () {
        const roles = await this.getRoles();

        return roles.find((r) => r.name === 'admin');
    };

    User.prototype.isUser = async function () {
        const roles = await this.getRoles();

        return !!roles.find((r) => r.name === 'user');
    };

    return User;
};
