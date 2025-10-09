const he = require('he');

const sanitizeData = (data) => {
  if (typeof data === 'string') {
    return he.encode(data, {
      'useNamedReferences': false,
      'encodeEverything': true,
    });
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const sanitizedObject = {};
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        sanitizedObject[key] = sanitizeData(data[key]);
      }
    }
    return sanitizedObject;
  }

  return data;
};

const xssSanitizer = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeData(req.body);
  }
  if (req.query) {
    req.query = sanitizeData(req.query);
  }
  if (req.params) {
    req.params = sanitizeData(req.params);
  }
  next();
};

module.exports = xssSanitizer;