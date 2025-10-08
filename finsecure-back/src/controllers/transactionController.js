const Transaction = require('../models/TransactionModel')
const Category = require('../models/categoryModel')
const User = require('../models/userModel')

const MissingValuesError = require('../errors/missingValuesError')
const NotFoundError = require('../errors/notFoundError')

const { buildLinks } = require('../utils/linksHelper')

class TransactionController {
   async getAllTransactions(req, res) {
      const transactions = await Transaction.findAll({
         include: [Category, User]
      })
      const baseUrl = `${req.protocol}://${req.get('host')}/api`

      const result = transactions.map(t => ({
         transaction: t,
         _links: buildLinks(baseUrl, 'transactions', t.id)
      }))

      return res.status(200).json({
         count: transactions.length,
         items: result
      })
   }

   async getTransactionById(req, res) {
      const id = Number(req.params.id)
      if (!id) throw new MissingValuesError({ id })

      const transaction = await Transaction.findByPk(id, { include: [Category, User] })
      if (!transaction)
         throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         transaction,
         _links: buildLinks(baseUrl, 'transactions', transaction.id)
      })
   }

   async createTransaction(req, res) {
      const { amount, type, description, categoryId, userId } = req.body
      if (!amount || !type || !categoryId || !userId)
         throw new MissingValuesError({ amount, type, categoryId, userId })

      const category = await Category.findByPk(categoryId)
      const user = await User.findByPk(userId)

      if (!category) throw new NotFoundError(`Categoria ID '${categoryId}' não encontrada!`)
      if (!user) throw new NotFoundError(`Usuário ID '${userId}' não encontrado!`)

      const transaction = await Transaction.create({
         amount,
         type,
         description,
         categoryId,
         userId
      })

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(201).json({
         transaction,
         _links: buildLinks(baseUrl, 'transactions', transaction.id)
      })
   }

   async updateTransaction(req, res) {
      const id = Number(req.params.id)
      const { amount, type, description, categoryId, userId } = req.body

      if (!id || !amount || !type || !categoryId || !userId)
         throw new MissingValuesError({ id, amount, type, categoryId, userId })

      const transaction = await Transaction.findByPk(id)
      if (!transaction)
         throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

      const category = await Category.findByPk(categoryId)
      const user = await User.findByPk(userId)
      if (!category) throw new NotFoundError(`Categoria ID '${categoryId}' não encontrada!`)
      if (!user) throw new NotFoundError(`Usuário ID '${userId}' não encontrado!`)

      transaction.amount = amount
      transaction.type = type
      transaction.description = description
      transaction.categoryId = categoryId
      transaction.userId = userId
      await transaction.save()

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         transaction,
         _links: buildLinks(baseUrl, 'transactions', transaction.id)
      })
   }

   async deleteTransaction(req, res) {
      const id = Number(req.params.id)
      if (!id) throw new MissingValuesError({ id })

      const transaction = await Transaction.findByPk(id)
      if (!transaction)
         throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

      await transaction.destroy()

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         message: `Transação ID '${id}' deletada com sucesso!`,
         _links: buildLinks(baseUrl, 'transactions', transaction.id, ['POST', 'GET'])
      })
   }
}

module.exports = new TransactionController()
