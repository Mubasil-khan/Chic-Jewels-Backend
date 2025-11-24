const addressSchema = require('../modal/Address')

const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body

        await addressSchema.create({ ...address, userId })
        res.json({ success: true, message: "Add Address" })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

const getAddress = async (req, res) => {
    try {
        const userId = req.userId; // get from authenticated request context
        const addresses = await addressSchema.find({ userId })

        res.json({ success: true, message: addresses })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

module.exports = { addAddress, getAddress }