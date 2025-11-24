
const mongoose = require('mongoose');


const ConnectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/greencart`)

    } catch (error) {
        console.error(error.message);

    }
}


module.exports = ConnectDB