const Transaction = require("../models/transactionModel")
const Category = require("../models/categoryModel")
const MissingValuesError = require("../errors/missingValuesError")
const NotFoundError = require("../errors/notFoundError")
const BadRequestError = require('../errors/badRequestError')
const { buildLinks } = require("../utils/linksHelper")

class TransactionController {
  async getAllTransactions(req, res) {
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      include: [{ model: Category, as: "category" }],
    })
    const baseUrl = `${req.protocol}://${req.get("host")}/api`

    const result = transactions.map((t) => ({
      transaction: t,
      _links: buildLinks(baseUrl, "transactions", t.id),
    }))

    return res.status(200).json({
      count: transactions.length,
      items: result,
    })
  }

  async getTransactionById(req, res) {
    const id = Number(req.params.id)
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError(`ID inválido: '${req.params.id}'. Deve ser um número inteiro positivo.`)
    }
    if (!id) throw new MissingValuesError({ id })

    const transaction = await Transaction.findOne({
      where: { id, userId: req.userId },
      include: [{ model: Category, as: "category" }],
    })
    if (!transaction)
      throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

    const baseUrl = `${req.protocol}://${req.get("host")}/api`
    return res.status(200).json({
      transaction,
      _links: buildLinks(baseUrl, "transactions", transaction.id),
    })
  }

  async createTransaction(req, res) {
    const { value, type, description, categoryId, date } = req.body
    const categoryIdNum = Number(categoryId)

    if (isNaN(categoryIdNum) || categoryIdNum <= 0) {
      throw new BadRequestError(`ID da Categoria inválido: '${categoryId}'. Deve ser um número inteiro positivo.`)
    }

    if (!value || !type || !categoryId || !date) {
      throw new MissingValuesError({ value, type, categoryId, date })
    }

    const category = await Category.findOne({ where: { id: categoryIdNum, userId: req.userId } })
    if (!category)
      throw new NotFoundError(`Categoria ID '${categoryIdNum}' não encontrada!`)

    const transactionData = {
      value,
      type,
      description,
      categoryId: categoryIdNum,
      date,
      userId: req.userId
    }

    if (req.file) {
      transactionData.receiptData = req.file.buffer
      transactionData.receiptMimeType = req.file.mimetype
    }

    const transaction = await Transaction.create(transactionData)

    const baseUrl = `${req.protocol}://${req.get("host")}/api`
    return res.status(201).json({
      transaction,
      _links: buildLinks(baseUrl, "transactions", transaction.id),
    })
  }

  async updateTransaction(req, res) {
    const id = Number(req.params.id)
    const { value, type, description, categoryId, date } = req.body
    const categoryIdNum = categoryId ? Number(categoryId) : undefined

    if (isNaN(id) || id <= 0) {
      throw new BadRequestError(`ID da Transação inválido: '${req.params.id}'. Deve ser um número inteiro positivo.`)
    }
    if (!id) throw new MissingValuesError({ id })

    const transaction = await Transaction.findOne({ where: { id, userId: req.userId } })
    if (!transaction)
      throw new NotFoundError(`Transação ID '${id}' não encontrada!`)

    if (categoryId) {
      if (isNaN(categoryIdNum) || categoryIdNum <= 0) {
        throw new BadRequestError(`ID da Categoria inválido: '${categoryId}'. Deve ser um número inteiro positivo.`)
      }
      const category = await Category.findOne({ where: { id: categoryIdNum, userId: req.userId } })
      if (!category)
        throw new NotFoundError(`Categoria ID '${categoryIdNum}' não encontrada!`)
    }

    if (req.file) {
      transaction.receiptData = req.file.buffer
      transaction.receiptMimeType = req.file.mimetype
    }

    transaction.value = value !== undefined ? value : transaction.value
    transaction.type = type || transaction.type
    transaction.description = description !== undefined ? description : transaction.description
    transaction.categoryId = categoryIdNum !== undefined ? categoryIdNum : transaction.categoryId
    transaction.date = date || transaction.date

    await transaction.save()

    const baseUrl = `${req.protocol}://${req.get("host")}/api`
    return res.status(200).json({
      transaction,
      _links: buildLinks(baseUrl, "transactions", transaction.id),
    })
  }

  async deleteTransaction(req, res) {
    const id = Number(req.params.id)
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError(`ID inválido: '${req.params.id}'. Deve ser um número inteiro positivo.`)
    }
    if (!id) throw new MissingValuesError({ id })

    const transaction = await Transaction.findOne({ where: { id, userId: req.userId } })
    if (!transaction) {
      throw new NotFoundError(`Transação ID '${id}' não encontrada!`)
    }

    await transaction.destroy()

    const baseUrl = `${req.protocol}://${req.get("host")}/api`
    return res.status(200).json({
      message: `Transação ID '${id}' deletada com sucesso!`,
      _links: buildLinks(baseUrl, "transactions", null, ["POST", "GET"]),
    })
  }

  async getTransactionReceipt(req, res) {
    const id = Number(req.params.id)
    if (isNaN(id) || id <= 0) {
      throw new BadRequestError(`ID inválido: '${req.params.id}'. Deve ser um número inteiro positivo.`)
    }
    if (!id) throw new MissingValuesError({ id })

    const transaction = await Transaction.findOne({
      where: { id, userId: req.userId },
      attributes: ["receiptData", "receiptMimeType"],
    })

    if (!transaction || !transaction.receiptData) {
      throw new NotFoundError(
        `Recibo para a Transação ID '${id}' não encontrado!`
      )
    }

    res.setHeader("Content-Type", transaction.receiptMimeType)
    res.send(transaction.receiptData)
  }
}

module.exports = new TransactionController()