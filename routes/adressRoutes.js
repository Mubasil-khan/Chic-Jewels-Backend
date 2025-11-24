const express = require('express')
const { addAddress, getAddress } = require('../Controller/addressController')
const { authUser } = require('../midalware/authuser')

const addressRouter = express.Router()

addressRouter.post("/add", authUser, addAddress)
addressRouter.get("/get", authUser, getAddress)


module.exports = addressRouter