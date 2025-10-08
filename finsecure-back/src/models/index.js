const User = require('./userModel')
const Category = require('./categoryModel')
const Transaction = require('./transactionModel')

User.hasMany(Category, {
   foreignKey: 'userId',
   as: 'categories'
})
Category.belongsTo(User, {
   foreignKey: 'userId',
   as: 'user'
})

User.hasMany(Transaction, {
   foreignKey: 'userId',
   as: 'transactions'
})
Transaction.belongsTo(User, {
   foreignKey: 'userId',
   as: 'user'
})

Category.hasMany(Transaction, {
   foreignKey: 'categoryId',
   as: 'transactions'
})
Transaction.belongsTo(Category, {
   foreignKey: 'categoryId',
   as: 'category'
})

module.exports = {
   User,
   Category,
   Transaction,
}