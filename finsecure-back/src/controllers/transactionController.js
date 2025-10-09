const Transaction = require('../models/transactionModel')
const Category = require('../models/categoryModel')
const MissingValuesError = require('../errors/missingValuesError')
const NotFoundError = require('../errors/notFoundError')
const { buildLinks } = require('../utils/linksHelper')

class TransactionController {
   async getAllTransactions(req, res) {
      const transactions = await Transaction.findAll({
         include: [{ model: Category, as: 'category' }]
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

      const transaction = await Transaction.findByPk(id, {
         include: [{ model: Category, as: 'category' }]
      })
      if (!transaction) throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         transaction,
         _links: buildLinks(baseUrl, 'transactions', transaction.id)
      })
   }

   async createTransaction(req, res) {
      const { value, type, description, categoryId, date, receiptPath } = req.body

      if (!value || !type || !categoryId || !date) {
         throw new MissingValuesError({ value, type, categoryId, date })
      }

      const category = await Category.findByPk(categoryId)
      if (!category) throw new NotFoundError(`Categoria ID '${categoryId}' não encontrada!`)

      const transaction = await Transaction.create({
         value,
         type,
         description,
         categoryId,
         date,
         receiptPath: receiptPath || null
      })

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(201).json({
         transaction,
         _links: buildLinks(baseUrl, 'transactions', transaction.id)
      })
   }

   async updateTransaction(req, res) {
      const id = Number(req.params.id)
      const { value, type, description, categoryId } = req.body

      if (!id || !value || !type || !categoryId)
         throw new MissingValuesError({ id, value, type, categoryId })

      const transaction = await Transaction.findByPk(id)
      if (!transaction)
         throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

      const category = await Category.findByPk(categoryId)
      if (!category) throw new NotFoundError(`Categoria ID '${categoryId}' não encontrada!`)

      await transaction.update({ value, type, description, categoryId })

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

   async getTransactionsByUser(req, res) {
      const { userId } = req.params
      if (!userId) throw new MissingValuesError({ userId })

      const transactions = await Transaction.findAll({
         where: { userId },
         include: [{ model: Category, as: 'category' }]
      })

      return res.status(200).json(transactions)
   }

   async getTransactionsByCategory(req, res) {
      const { categoryId } = req.params
      if (!categoryId) throw new MissingValuesError({ categoryId })

      const transactions = await Transaction.findAll({
         where: { categoryId },
         include: [{ model: Category, as: 'category' }]
      })

      return res.status(200).json(transactions)
   }
}

module.exports = new TransactionController()