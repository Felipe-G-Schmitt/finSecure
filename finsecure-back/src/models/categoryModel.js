const database = require('../config/database')
const User = require('./userModel')

class Category {
   constructor() {
      this.model = database.define('category', {
         id: {
            type: database.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
         },
         name: {
            type: database.Sequelize.STRING,
            allowNull: false
         },
         type: {
            type: database.Sequelize.ENUM('receita', 'despesa'),
            allowNull: false
         },
         userId: {
            type: database.Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: User,
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
   }
}

module.exports = (new Category).model