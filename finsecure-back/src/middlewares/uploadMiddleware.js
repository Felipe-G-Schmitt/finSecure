const multer = require('multer') // Para o upload de arquivos, a biblioteca multer é a mais indicada. Ela simplifica o processo de manipulação de multipart/form-data. Primeiro, certifique-se de instalá-la
const path = require('path')

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/')
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
   }
})

const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      cb(null, true)
   } else {
      cb(new Error('Formato de arquivo não suportado! Apenas imagens (jpeg, png) e PDFs são permitidos.'), false)
   }
}

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 1024 * 1024 * 5
   },
   fileFilter: fileFilter
})

module.exports = upload