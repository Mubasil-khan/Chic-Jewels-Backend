const jwt = require('jsonwebtoken');


const SellerLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });
            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ success: true, message: "🎉 Welcome back, Seller!  " })
        }
        else {
            return res.json({ success: false, message: " Oops!  failed " })
        }
    } catch (error) {
        return res.json({ success: false, message: error.message })

    }

}

const ISAuthSeller = async (req, res) => {
    try {

        return res.json({ succes: true })
    } catch (error) {
        console.error(error);

        res.json({ succes: false, message: error.message })
    }
}

const SellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true
        })
        return res.json({ success: true, message: "Seller Logout Successfully" })
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message })

    }
}

module.exports = { SellerLogin, ISAuthSeller, SellerLogout }