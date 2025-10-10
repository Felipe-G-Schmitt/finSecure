const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const upload = require('../middlewares/uploadMiddleware') 

router.get('/transactions', transactionController.getAllTransactions)
router.post('/transactions', upload.single('receipt'), transactionController.createTransaction) 
router.get('/transactions/:id', transactionController.getTransactionById)
router.put('/transactions/:id', upload.single('receipt'), transactionController.updateTransaction)
router.delete('/transactions/:id', transactionController.deleteTransaction)

router.get('/transactions/:id/receipt', transactionController.getTransactionReceipt)

module.exports = router