class ForbiddenError extends Error {
   constructor(message = 'Ação proibida!') {
      super(message);
      this.statusCode = 403;
   }
}

module.exports = ForbiddenError;