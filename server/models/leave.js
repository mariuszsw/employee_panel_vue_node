module.exports = (sequelize, DataTypes) => {
    const Leave = sequelize.define('Leave', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        leaveDays: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        start: {
            allowNull: false,
            type: DataTypes.DATEONLY
        },
        end: {
            allowNull: false,
            type: DataTypes.DATEONLY
        },
        approved: {
            allowNull: false,
            type: DataTypes.BOOLEAN
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
    });

    Leave.associate = function (models) {
        Leave.belongsTo(models.Contract, {
            as: 'user'
        });
    };

    return Leave;
};
