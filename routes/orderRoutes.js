const express = require('express')
const { authUser } = require('../midalware/authuser')
const { getOrder, getAllOrders, createorder } = require('../Controller/orderController')
const { AuthSeller } = require('../midalware/authSeller')

const orderRouter = express.Router()

orderRouter.post("/createOrder", authUser, createorder)

orderRouter.get("/user", authUser, getOrder)

orderRouter.get("/seller", getAllOrders)

module.exports = orderRouter 