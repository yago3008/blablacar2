const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Car = require('./Car');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    carID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Car,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    origin: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0,
        },
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
        },
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
        },
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1,
        },
    },
}, {
    tableName: 'trips',
    timestamps: false,
});

User.hasMany(Trip, { foreignKey: 'userID', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'userID' });

Car.hasMany(Trip, { foreignKey: 'carID', onDelete: 'CASCADE' });
Trip.belongsTo(Car, { foreignKey: 'carID' });

module.exports = Trip;
