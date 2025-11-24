require('dotenv').config();
const cookieParser = require("cookie-parser")
const cors = require('cors')

const express = require("express")
const ConnectDB = require("./configs/db");
const UserRouter = require("./routes/userRoutes");
const sellerRouter = require('./routes/SellerRoutes');
const connectcloudinary = require('./configs/cloudinary.JS');
const ProductRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const addressRouter = require('./routes/adressRoutes');
const orderRouter = require('./routes/orderRoutes');
const app = express()

const port = process.env.PORT || 4000

const allowedOrigins = ["https://chicjewelsbyayesha.netlify.app"]

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))


const StartServer = async () => {
    try {
        await ConnectDB()
        await connectcloudinary()

        app.get("/", function (req, res) {
            res.send("working done")
        })
        app.use("/user", UserRouter);
        app.use("/seller", sellerRouter)
        app.use("/product", ProductRouter)
        app.use("/cart", cartRouter)
        app.use("/address", addressRouter)
        app.use("/order", orderRouter)
        app.listen(port)

    } catch (error) {
        console.error(error);

    }
}

StartServer()

