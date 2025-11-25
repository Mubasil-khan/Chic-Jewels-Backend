const jwt = require("jsonwebtoken")

const AuthSeller = async (req, res, next) => {

    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.json({ success: false, message: "Not Authorize" })
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET)

        if (decoded.email == process.env.SELLER_EMAIL) {
            res.json({ success: true, message: 'success' })
            return next()
        }
        else {
            res.json({ success: false, message: 'not a token' })
        }
    } catch (error) {
        res.json({ success: false, message: "error.message" })

    }
}

module.exports = { AuthSeller }