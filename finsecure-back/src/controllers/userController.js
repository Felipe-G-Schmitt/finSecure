const bcrypt = require('bcryptjs')
const ConflictError = require('../errors/conflictError')
const ForbiddenError = require('../errors/forbiddenError')
const MissingValuesError = require('../errors/missingValuesError')
const NotFoundError = require('../errors/notFoundError')

const User = require('../models/userModel')
const Transaction = require('../models/transactionModel')
const Category = require('../models/categoryModel')

const { buildLinks } = require('../utils/linksHelper')

const saltRounds = 10

class UserController {
   async getAllUsers(req, res) {
      const user = await User.findByPk(req.userId)
      if (!user) {
         throw new NotFoundError(`Usuário ID '${req.userId}' não encontrado!`)
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      const result = [{
         user,
         _links: buildLinks(baseUrl, 'users', user.id)
      }]

      return res.status(200).json({
         count: 1,
         items: result
      })
   }

   async getUserById(req, res) {
      const id = Number(req.params.id)
      if (!id) throw new MissingValuesError({ id })

      if (id !== req.userId) {
         throw new ForbiddenError('Acesso negado. Você só pode visualizar seu próprio perfil.')
      }

      const user = await User.findByPk(id)
      if (!user) throw new NotFoundError(`Usuário ID '${id}' não encontrado!`)

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         user,
         _links: buildLinks(baseUrl, 'users', user.id)
      })
   }

   async createUser(req, res) {
      const { name, email, password } = req.body
      if (!name || !email || !password)
         throw new MissingValuesError({ name, email, password })

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) throw new ConflictError(`Email '${email}' já cadastrado!`)

      const encryptedPassword = await bcrypt.hash(password, saltRounds)
      const user = await User.create({ name, email, password: encryptedPassword })

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(201).json({
         user,
         _links: buildLinks(baseUrl, 'users', user.id)
      })
   }

   async updateUser(req, res) {
      const id = Number(req.params.id)
      const { name, email, password } = req.body

      if (!id || !name || !email || !password)
         throw new MissingValuesError({ id, name, email, password })

      if (id !== req.userId) {
         throw new ForbiddenError('Usuário não autorizado a editar outro usuário!')
      }

      const user = await User.findByPk(id)
      if (!user) throw new NotFoundError(`Usuário ID '${id}' não encontrado!`)

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser && existingUser.id !== id)
         throw new ConflictError(`Email '${email}' já cadastrado!`)

      const encryptedPassword = await bcrypt.hash(password, saltRounds)
      user.name = name
      user.email = email
      user.password = encryptedPassword
      await user.save()

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         user,
         _links: buildLinks(baseUrl, 'users', user.id)
      })
   }

   async deleteUser(req, res) {
      const id = Number(req.params.id)
      if (!id) throw new MissingValuesError({ id })

      const user = await User.findByPk(id)
      if (!user) throw new NotFoundError(`Usuário ID '${id}' não encontrado!`)

      if (req.userId !== id)
         throw new ForbiddenError('Usuário não autorizado a deletar outra conta!')

      const userTransactions = await Transaction.findAll({ where: { userId: id } })
      if (userTransactions.length > 0)
         throw new ForbiddenError('Usuário possui transações associadas. Exclua-as antes de deletar.')

      const userCategories = await Category.findAll({ where: { userId: id } })
      if (userCategories.length > 0)
         throw new ForbiddenError('Usuário possui categorias associadas. Exclua-as antes de deletar.')

      await user.destroy()

      const baseUrl = `${req.protocol}://${req.get('host')}/api`
      return res.status(200).json({
         message: `Usuário ID '${id}' deletado com sucesso!`,
         _links: buildLinks(baseUrl, 'users', user.id, ['POST', 'GET'])
      })
   }
}

module.exports = new UserController()