require("dotenv").config();
const nodemailer = require("nodemailer");

// Create transporter with IPv4 forced
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password if using Gmail
    },
    family: 4 // Force IPv4
});

async function sendEmail(to, subject, text, html) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        console.log(`✅ Email sent to ${to}:`, info.response);
    } catch (err) {
        console.error(`❌ Email error for ${to}:`, err.message);
    }
}

module.exports = sendEmail;
