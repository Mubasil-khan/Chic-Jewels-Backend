const express = require('express')
const { UpdateCart } = require('../Controller/cartController')
const { authUser } = require('../midalware/authuser');

const cartRouter = express.Router()

cartRouter.post("/update", authUser, UpdateCart)

module.exports = cartRouter 