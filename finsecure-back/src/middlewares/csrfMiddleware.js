const crypto = require('crypto')

class CsrfMiddleware {
   static generateToken(req, res, next) {
      const token = crypto.randomBytes(32).toString('hex')

      res.cookie('csrfToken', token, { httpOnly: true })

      req.csrfToken = token
      next()
   }

   static validateToken(req, res, next) {
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
         return next()
      }

      const csrfToken = req.headers['x-csrf-token']
      const cookieToken = req.cookies.csrfToken

      if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
         if (process.env.NODE_ENV !== 'production') {
            console.error('Falha na validação do CSRF:', { header: csrfToken, cookie: cookieToken });
         }
         return res.status(403).json({ error: 'Token CSRF inválido ou ausente!' })
      }

      next()
   }
}

module.exports = CsrfMiddleware