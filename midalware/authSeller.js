// AuthSeller middleware
const AuthSeller = (req, res, next) => {
    const token = req.cookies?.sellerToken;
    if (!token) return res.status(401).json({ success: false, message: "Not Authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // optionally check email
        if (decoded.email !== process.env.SELLER_EMAIL) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        req.seller = decoded; // attach data for next handlers
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = { AuthSeller };
