const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'not a token' })
    }

    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const decoded = jwt.verify(token, "secrectKey")

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