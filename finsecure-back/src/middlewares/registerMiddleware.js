const bcrypt = require('bcryptjs')

const ConflictError = require('../errors/conflictError')
const MissingValuesError = require('../errors/missingValuesError')

const User = require('../models/userModel')

const saltRounds = 10

class AuthRegister {
   async register(req, res) {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
         throw new MissingValuesError({ name, email, password })
      }

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
         throw new ConflictError(`O email '${email}' já está cadastrado!`)
      }

      const encryptedPassword = await bcrypt.hash(password, saltRounds)

      const user = await User.create({
         name,
         email,
         password: encryptedPassword
      })

      const baseUrl = `${req.protocol}://${req.get('host')}/api`

      return res.status(201).json({
         message: `Usuário registrado com sucesso com o email: '${email}'!`,
         user: {
            id: user.id,
            name: user.name,
            email: user.email
         },
         _links: {
            self: { href: `${baseUrl}/register`, method: 'POST' },
            login: { href: `${baseUrl}/login`, method: 'POST' },
            docs: { href: `${baseUrl}/docs`, method: 'GET' }
         }
      })
   }
}

module.exports = new AuthRegister()