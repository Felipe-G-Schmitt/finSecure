const express = require('express')
const cors = require('cors')
require('dotenv').config()

const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware')
const loginMiddleware = require('./middlewares/loginMiddleware')
const registerMiddleware = require('./middlewares/registerMiddleware')
const tokenMiddleware = require('./middlewares/tokenMiddleware')

const categoryRoutes = require('./routes/categoryRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const userRoutes = require('./routes/userRoutes')
const database = require('./config/database')

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
app.use(errorHandlerMiddleware)

// 🔹 Inicialização do servidor
const PORT = process.env.PORT || 3001
database.sync({ force: true })
   .then(() => {
      app.listen(Number(PORT), () => 
         console.log(`🚀 Servidor rodando na porta: ${PORT}`)
      )
   })
   .catch(error => {
      console.error('Erro ao sincronizar o banco de dados:', error)
   })