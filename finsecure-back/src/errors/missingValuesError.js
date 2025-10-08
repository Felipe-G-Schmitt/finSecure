function makeMessage(object, message) {
   const keys = Object.keys(object)
   if (keys.length === 0) {
      return message
   }

   const fields = Object.values(object)
   const fieldsMessage = fields
      .map((field, index) => !field ? `"${keys[index]}"` : null)
      .filter(field => field !== null)
      .join(', ')

   return `Faltam os seguintes valores obrigatórios: ${fieldsMessage}.`
}

class MissingValuesError extends Error {
   constructor(object, message = 'Faltam valores obrigatórios!') {
      super(makeMessage(object, message))
      this.statusCode = 400
   }
}

module.exports = MissingValuesError