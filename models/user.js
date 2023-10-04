const Sequelize = require('sequelize')
const database = require('../db')

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    money: {
        type: Sequelize.NUMBER,
        default: 0
    },
    wins: {
        type: Sequelize.INTEGER.UNSIGNED,
        default: 0
    }
})

module.exports = User