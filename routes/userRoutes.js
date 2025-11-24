const express = require('express')
const { register, LoginUser, isAuth, logout } = require('../Controller/UserController')
const { authUser } = require('../midalware/authuser')


const UserRouter = express.Router()
UserRouter.post('/register', register)

UserRouter.post('/login', LoginUser)

UserRouter.get('/isAuth', authUser, isAuth)

UserRouter.get('/logout', authUser, logout)


module.exports = UserRouter;



