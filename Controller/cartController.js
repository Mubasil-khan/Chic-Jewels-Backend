const user = require("../modal/user");

const UpdateCart = async (req, res) => {
    try {
        const { userId, cart } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        await user.findByIdAndUpdate(userId, { CartItems: cart });

        res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { UpdateCart };
