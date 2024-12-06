const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('blablacar2', 'blablacar2', 'blablacar2', {
    host: 'localhost',
    dialect: 'mysql',
});


module.exports = { sequelize }