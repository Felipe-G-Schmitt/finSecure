const database = require('../config/database')
const User = require('./userModel')
const Category = require('./categoryModel')

class Transaction {
   constructor() {
      this.model = database.define('transaction', {
         id: {
            type: database.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
         },
         type: {
            type: database.Sequelize.ENUM('receita', 'despesa'),
            allowNull: false
         },
         value: {
            type: database.Sequelize.DECIMAL(10, 2),
            allowNull: false
         },
         description: {
            type: database.Sequelize.TEXT,
            allowNull: true
         },
         date: {
            type: database.Sequelize.DATEONLY,
            allowNull: false
         },
         receiptUrl: {
            type: database.Sequelize.STRING,
            allowNull: true
         },
         userId: {
            type: database.Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: User,
               key: 'id'
            }
         },
         categoryId: {
            type: database.Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: Category,
               key: 'id'
            }
         },
         createdAt: {
            type: database.Sequelize.DATE,
            defaultValue: database.Sequelize.NOW
         },
         updatedAt: {
            type: database.Sequelize.DATE,
            defaultValue: database.Sequelize.NOW
         }
      })

      User.hasMany(this.model, { foreignKey: 'userId' })
      this.model.belongsTo(User, { foreignKey: 'userId' })

      Category.hasMany(this.model, { foreignKey: 'categoryId' })
      this.model.belongsTo(Category, { foreignKey: 'categoryId' })
   }
}

module.exports = (new Transaction).model