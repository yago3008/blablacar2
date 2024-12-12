const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rate = sequelize.define('Rate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    evaluatorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stars: {
        type: DataTypes.FLOAT(3),
        allowNull: false
    },
    evaluateeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'rate',
    timestamps: false,
});

module.exports = Rate;