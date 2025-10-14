const errorHandlerMiddleware = (error, req, res, next) => {
   let statusCode = error.statusCode || 500
   let message = error.message || 'Ocorreu um erro interno no servidor.'

   if (process.env.NODE_ENV !== 'production') {
      console.error('------------------------------------------------')
      console.error('Ocorreu um erro na aplicação:')
      console.error('Status Code:', statusCode)
      console.error('Mensagem:', message)
      if (error.stack) {
         console.error('Stack Trace:', error.stack)
      }
      console.error('------------------------------------------------')
   }

   if (process.env.NODE_ENV === 'production' && !error.statusCode) {
      message = 'Ocorreu um erro interno no servidor.'
   }

   res.status(statusCode).json({
      error: {
         message: message,
         statusCode: statusCode,
      },
   })
}

module.exports = errorHandlerMiddleware