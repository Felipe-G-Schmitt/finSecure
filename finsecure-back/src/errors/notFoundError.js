class NotFoundError extends Error {
   constructor(message = 'Recurso não encontrado!') {
      super(message);
      this.statusCode = 404;
   }
}

module.exports = NotFoundError;