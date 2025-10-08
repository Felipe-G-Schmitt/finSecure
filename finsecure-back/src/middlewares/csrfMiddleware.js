const crypto = require('crypto')

class CsrfMiddleware {
   static generateToken(req, res, next) {
      const token = crypto.randomBytes(32).toString('hex')
      res.cookie('csrfToken', token, { httpOnly: true, secure: true })
      req.csrfToken = token
      next()
   }

   static validateToken(req, res, next) {
      const csrfToken = req.headers['x-csrf-token']
      const cookieToken = req.cookies.csrfToken

      if (csrfToken !== cookieToken) {
         return res.status(403).json({ error: 'Token CSRF inválido!' })
      }
      next()
   }
}

module.exports = CsrfMiddleware