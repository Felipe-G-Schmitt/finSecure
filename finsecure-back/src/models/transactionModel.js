const { DataTypes } = require("sequelize")
const database = require("../config/database")
const Category = require("./categoryModel")

const Transaction = database.define(
  "transaction",
  {
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
      type: DataTypes.ENUM("receita", "despesa"),
      allowNull: false,
    },
    receiptData: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    receiptMimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiptUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.getDataValue("receiptData")) {
          return null
        }
        const baseUrl = process.env.APP_URL || "http://localhost:3001"
        const id = this.getDataValue("id")
        return `${baseUrl}/api/transactions/${id}/receipt`
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
)

Transaction.belongsTo(Category, { foreignKey: "categoryId", as: "category" })
Category.hasMany(Transaction, { foreignKey: "categoryId", as: "transactions" })

module.exports = Transaction