// authUser middleware
const authUser = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

module.exports = { authUser };
