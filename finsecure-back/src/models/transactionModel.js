const { DataTypes } = require('sequelize')
const database = require('../config/database')

const Transaction = database.define('transaction', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   description: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
   },
   date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
   },
   type: {
      type: DataTypes.ENUM('receita', 'despesa'),
      allowNull: false,
   },
   receiptPath: {
      type: DataTypes.STRING,
      allowNull: true,
   },
})

module.exports = Transaction