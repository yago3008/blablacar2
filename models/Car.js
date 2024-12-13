const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    model: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1990,
            max: new Date().getFullYear(),
        },
    },
    color: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    licensePlate: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'cars',
    timestamps: false,
});

User.hasMany(Car, { foreignKey: 'userID', onDelete: 'CASCADE' });
Car.belongsTo(User, { foreignKey: 'userID' });

module.exports = Car;
