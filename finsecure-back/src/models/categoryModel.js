const { DataTypes } = require('sequelize')
const database = require('../config/database')

const Category = database.define('category', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   type: {
      type: DataTypes.ENUM('receita', 'despesa'),
      allowNull: false,
   },
})

module.exports = Category