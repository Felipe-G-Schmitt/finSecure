const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const upload = require('../middlewares/uploadMiddleware') // para anexar comprovantes

// Rotas de transações (receitas e despesas)
router.get('/transactions', transactionController.getAllTransactions)
router.get('/transactions/:id', transactionController.getTransactionById)
router.post('/transactions', upload.single('receipt'), transactionController.createTransaction)
router.put('/transactions/:id', upload.single('receipt'), transactionController.updateTransaction)
router.delete('/transactions/:id', transactionController.deleteTransaction)

router.get('/transactions/user/:userId', transactionController.getTransactionsByUser)
router.get('/transactions/category/:categoryId', transactionController.getTransactionsByCategory)

module.exports = router