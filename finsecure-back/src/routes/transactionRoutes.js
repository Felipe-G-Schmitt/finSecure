const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const upload = require('../middlewares/uploadMiddleware')

router.get('/transactions', transactionController.getAllTransactions.bind(transactionController))
router.get('/transactions/:id', transactionController.getTransactionById.bind(transactionController))

router.post('/transactions', upload.single('receipt'), transactionController.createTransaction.bind(transactionController))
router.put('/transactions/:id', upload.single('receipt'), transactionController.updateTransaction.bind(transactionController))

router.delete('/transactions/:id', transactionController.deleteTransaction.bind(transactionController))

router.get('/transactions/user/:userId', transactionController.getTransactionsByUser.bind(transactionController))
router.get('/transactions/category/:categoryId', transactionController.getTransactionsByCategory.bind(transactionController))

module.exports = router