const express = require('express')
const { SellerLogin, SellerLogout, ISAuthSeller } = require('../Controller/SellerController')
const { AuthSeller } = require('../midalware/authSeller')


const sellerRouter = express.Router()


sellerRouter.post("/login", SellerLogin)
sellerRouter.get("/AuthSeller", AuthSeller, ISAuthSeller)
sellerRouter.get("/logout", SellerLogout)


module.exports = sellerRouter