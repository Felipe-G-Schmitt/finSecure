function buildLinks(baseUrl, resource, id = null, allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']) {
   const url = id === null
      ? `${baseUrl}/${resource}`
      : `${baseUrl}/${resource}/${id}`

   const links = {
      self: { href: url, method: id === null ? 'GET' : 'GET' },
      list: { href: `${baseUrl}/${resource}`, method: 'GET' },
   }

   if (allowedMethods.includes('POST')) {
      links.create = { href: `${baseUrl}/${resource}`, method: 'POST' }
   }

   if (id !== null) {
      if (allowedMethods.includes('PUT')) {
         links.update = { href: url, method: id === null ? 'PUT' : 'PUT' }
      }
      if (allowedMethods.includes('DELETE')) {
         links.delete = { href: url, method: id === null ? 'DELETE' : 'DELETE' }
      }
   }

   return links
}

module.exports = { buildLinks }