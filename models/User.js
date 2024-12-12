const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    emailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false 
    },
    verificationToken: {
        type: DataTypes.STRING(500),
        defaultValue: false
    },
    birth:{
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate:{
            isDate: true
        }
    },
    driverLicense: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    rateNote: {
        type: DataTypes.FLOAT(3, 2),
        defaultValue: 5.00,
        validate: {
            min: 0.00,
            max: 5.00,
        },
    },
    rateQty: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    tableName: 'users',
    timestamps: false,

});

module.exports = User;