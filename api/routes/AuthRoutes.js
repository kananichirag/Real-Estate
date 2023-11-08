const expresss = require('express');
const AutjController = require('../controller/AutjController')
const Auth = expresss.Router();

Auth.post('/signup',AutjController.Signup)
Auth.post('/signin',AutjController.Signin)
Auth.post('/google',AutjController.Google)
Auth.get('/signout',AutjController.SignOut)

module.exports = Auth;