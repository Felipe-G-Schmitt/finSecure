const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const MissingValuesError = require('../errors/missingValuesError')
const NotFoundError = require('../errors/notFoundError')

const User = require('../models/userModel')

class AuthLogin {
   async login(req, res) {
      const { email, password } = req.body

      if (!email || !password) {
         throw new MissingValuesError({ email, password })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
         throw new NotFoundError(`Usuário não encontrado!`)
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
         throw new MissingValuesError({}, 'Senha incorreta!')
      }

      const jwtToken = jwt.sign(
         { id: user.id },
         process.env.JWT_SECRET_KEY,
         { expiresIn: "1h" }
      )

      res.cookie('token', jwtToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: 3600000
      });

      const baseUrl = `${req.protocol}://${req.get('host')}/api`

      return res.status(200).json({
         message: `Login realizado com sucesso para o email: '${email}'!`,
         _links: {
            self: { href: `${baseUrl}/login`, method: 'POST' },
            register: { href: `${baseUrl}/register`, method: 'POST' },
            transactions: { href: `${baseUrl}/transactions`, method: 'GET' },
            categories: { href: `${baseUrl}/categories`, method: 'GET' },
            dashboard: { href: `${baseUrl}/dashboard`, method: 'GET' }
         }
      })
   }
}

module.exports = new AuthLogin()