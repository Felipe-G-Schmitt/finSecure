const Category = require('../models/categoryModel')
const Transaction = require('../models/transactionModel')
const ConflictError = require('../errors/conflictError')
const ForbiddenError = require('../errors/forbiddenError')
const MissingValuesError = require('../errors/missingValuesError')
const NotFoundError = require('../errors/notFoundError')

const { buildLinks } = require('../utils/linksHelper')

class CategoryController {
   async getAllCategories(req, res) {
      const categories = await Category.findAll()
      const baseUrl = `${req.protocol}://${req.get('host')}/api`

      const result = categories.map(c => ({
         category: c,
         _links: buildLinks(baseUrl, 'categories', c.id)
      }))

      return res.status(200).json({
         count: categories.length,
         items: result
      })
   }

   async getCategoryById(req, res) {
      const id = Number(req.params.id)
      if (!id) throw new MissingValuesError({ id })

      const category = await Category.findByPk(id)
      if (!category) throw new NotFoundError(`Categoria ID '${id}' não encontrada!`)

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         category,
         _links: buildLinks(baseUrl, 'categories', category.id)
      })
   }

   async createCategory(req, res) {
      const { name, type } = req.body

      if (!name || !type) throw new MissingValuesError({ name, type })

      if (!['receita', 'despesa'].includes(type))
         throw new ConflictError(`O tipo '${type}' é inválido! Use 'receita' ou 'despesa'.`)

      const existingCategory = await Category.findOne({ where: { name } })

      if (existingCategory)
         throw new ConflictError(`Já existe uma categoria com o nome '${name}'!`)

      const category = await Category.create({ name, type })
      const baseUrl = `${req.protocol}://${req.get('host')}/api`

      return res.status(201).json({
         category,
         _links: buildLinks(baseUrl, 'categories', category.id)
      })
   }

   async updateCategory(req, res) {
      const id = Number(req.params.id)
      const { name, type } = req.body

      if (!id || !name || !type) throw new MissingValuesError({ id, name, type })

      const category = await Category.findByPk(id)
      if (!category) throw new NotFoundError(`Categoria ID '${id}' não encontrada!`)

      const duplicate = await Category.findOne({ where: { name } })
      if (duplicate && duplicate.id !== id)
         throw new ConflictError(`Já existe uma categoria com o nome '${name}'!`)

      category.name = name
      category.type = type
      await category.save()

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         category,
         _links: buildLinks(baseUrl, 'categories', category.id)
      })
   }

   async deleteCategory(req, res) {
      const id = Number(req.params.id)
      if (!id) throw new MissingValuesError({ id })

      const category = await Category.findByPk(id)
      if (!category) throw new NotFoundError(`Categoria ID '${id}' não encontrada!`)

      const transactions = await Transaction.findAll({ where: { categoryId: id } })
      if (transactions.length > 0)
         throw new ForbiddenError(`Não é possível excluir categoria com transações associadas!`)

      await category.destroy()

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         message: `Categoria ID '${id}' deletada com sucesso!`,
         _links: buildLinks(baseUrl, 'categories', category.id, ['POST', 'GET'])
      })
   }
}

module.exports = new CategoryController()