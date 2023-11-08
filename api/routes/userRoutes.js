const express = require('express')
const User = express.Router();
const UserController = require('../controller/UserController')
const {verifyToken} = require('../utills/VerfiyUser')

User.post('/update/:id',verifyToken,UserController.UpdateUser)
User.delete('/delete/:id',verifyToken,UserController.DeleteUser)
User.get('/listings/:id',verifyToken,UserController.GetUserListing)
User.get('/:id',verifyToken,UserController.GetUser)

module.exports = User;