const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const loginMiddleware = require('../middlewares/loginMiddleware')
const registerMiddleware = require('../middlewares/registerMiddleware')

router.post('/register', registerMiddleware.register) 
router.post('/login', loginMiddleware.login)
router.get('/users', userController.getAllUsers) 
router.get('/users/:id', userController.getUserById) 
router.put('/users/:id', userController.updateUser) 
router.delete('/users/:id', userController.deleteUser) 

module.exports = router