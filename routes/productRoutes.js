const express = require('express')
const upload = require('../configs/multer')
const { AuthSeller } = require('../midalware/authSeller')
const { addProduct, ProductList, ProductById, ChangeStock, BestSellers } = require('../Controller/ProductController')

const ProductRouter = express.Router()

ProductRouter.post("/add", upload.array("images", 5), AuthSeller, addProduct)
ProductRouter.get("/list", ProductList)
ProductRouter.get("/id", ProductById)
ProductRouter.post("/stock", AuthSeller, ChangeStock)
ProductRouter.post("/bestSellers", AuthSeller, BestSellers)


module.exports = ProductRouter