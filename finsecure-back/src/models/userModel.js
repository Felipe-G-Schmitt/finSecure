const database = require('../config/database')

class User {
   constructor() {
      this.model = database.define('user', {
         id: {
            type: database.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         name: {
            type: database.Sequelize.STRING,
            allowNull: false
         },
         email: {
            type: database.Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
               isEmail: true
            }
         },
         password: {
            type: database.Sequelize.STRING,
            allowNull: false
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
   }
}

module.exports = (new User).model