const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {

    const { UserToken } = req.cookies;

    if (!UserToken) {
        return res.json({ success: false, message: 'not a token' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.id) {
            req.userId = decoded.id
            return next();
        }
        else {
            res.json({ success: false, message: 'token issue' })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }


}

module.exports = { authUser }