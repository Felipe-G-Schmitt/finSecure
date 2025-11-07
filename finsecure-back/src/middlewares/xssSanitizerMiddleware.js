const he = require('he')

const SAFE_KEYS = ['type', 'value', 'date', 'categoryId', 'name']

const sanitizeData = (data) => {
  if (typeof data === 'string') {
    return he.escape(data)
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item))
  }

  if (typeof data === 'object' && data !== null) {
    if (data.receiptData && (data.receiptData instanceof Buffer)) {
      const sanitizedObject = { ...data } 
      delete sanitizedObject.receiptData 
      const restSanitized = sanitizeData(sanitizedObject) 
      return {
        ...restSanitized,
        receiptData: data.receiptData
      }
    }
    
    const sanitizedObject = {}
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        if (SAFE_KEYS.includes(key)) {
          sanitizedObject[key] = data[key]
        } else {
          sanitizedObject[key] = sanitizeData(data[key])
        }
      }
    }
    return sanitizedObject
  }

  return data
}

const xssSanitizer = (req, res, next) => {
  
  if (req.body) {
     req.body = sanitizeData(req.body)
  }

  if (req.query) {
    req.query = sanitizeData(req.query)
  }
  if (req.params) {
    req.params = sanitizeData(req.params)
  }

  next()
}

module.exports = xssSanitizer