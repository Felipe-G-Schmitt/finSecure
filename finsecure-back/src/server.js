const express = require('express')
const cors = require('cors')
require('dotenv').config()

const errorHandler = require('./middlewares/errorHandler')
const loginMiddleware = require('./middlewares/loginMiddleware')
const registerMiddleware = require('./middlewares/registerMiddleware')
const tokenMiddleware = require('./middlewares/tokenMiddleware')

const categoryRoutes = require('./routes/categoryRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(express.json())
app.use(cors())

// 🔹 Rotas públicas
app.post('/api/login', (req, res, next) => loginMiddleware.login(req, res, next))
app.post('/api/register', (req, res, next) => registerMiddleware.register(req, res, next))

// 🔹 Rotas protegidas
app.use('/api', tokenMiddleware.validateToken, categoryRoutes)
app.use('/api', tokenMiddleware.validateToken, transactionRoutes)
app.use('/api', tokenMiddleware.validateToken, userRoutes)

// 🔹 Middleware global de erros
app.use(errorHandler)

// 🔹 Inicialização do servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
   console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})