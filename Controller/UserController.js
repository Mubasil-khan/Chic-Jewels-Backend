const user = require("../modal/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register Controller
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate fields
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Check if user exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create new user
        const createdUser = await user.create({
            name,
            email,
            password: hashedPassword,
        });

        // Create JWT token
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set cookie
        res.cookie('UserToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Render पर true
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "User Registered Successfully",

        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const LoginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ succes: false, message: "Missing" })
        }

        const existingUser = await user.findOne({ email })

        if (!existingUser) {
            return res.json({ success: false, message: "User Not Found" })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) {
            return res.json({ succes: false, message: "InValid Password" })
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie('UserToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Render पर true
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({
            success: true,
            message: "User Login Successfully",

        });

    } catch (error) {
        // console.error(error);
        res.json({ success: false, message: error.message })

    }

}

// const isAuth = async (req, res) => {
//     try {
//         const { userId } = req.body



//         const FindUser = await user.findById(userId).select("-password")

//         return res.json({ succes: true, FindUser })
//     } catch (error) {
//         console.error(error);

//         res.json({ succes: false, message: error.message })

//     }
// }

const isAuth = async (req, res) => {
    try {
        const findUser = await user.findById(req.userId).select("-password")

        return res.json({ success: true, findUser })
    } catch (error) {
        console.error(error);

        res.json({ succes: false, message: error.message })
    }
}



const logout = async (req, res) => {
    try {
        res.clearCookie('UserToken', {
            httpOnly: true
        })
        return res.json({ success: true, message: "Logout Successfully" })
    } catch (error) {
        console.error(error);

    }
}

module.exports = { register, LoginUser, isAuth, logout };
