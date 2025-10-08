const jwt = require('jsonwebtoken')
require('dotenv').config()

const UnauthorizedError = require('../errors/unauthorizedError')

class AuthToken {
   async validateToken(req, res, next) {
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) {
         throw new UnauthorizedError('Não autorizado! Token não fornecido.')
      }

      try {
         const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
         req.userId = payload.id // armazena o id do usuário autenticado
         next()
      } catch (error) {
         throw new UnauthorizedError('Token inválido ou expirado.')
      }
   }
}

module.exports = new AuthToken()