const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {

    const token = req.cookies?.UserToken || null;



    if (!token) {
        return res.json({ success: false, message: 'not a UserToken' })
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