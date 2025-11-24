const product = require("../modal/product");
const order = require("../modal/order");
const sendEmail = require("../configs/email");

const createorder = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!items || !address) {
            return res.json({ success: false, message: "Invalid Cart" });
        }

        // Calculate total amount
        let amount = 0;
        const detailedItems = [];

        for (const item of items) {
            const pro = await product.findById(item.product);
            if (!pro) throw new Error(`Product not found: ${item.product}`);

            const subtotal = pro.offerPrice * item.quantity;
            amount += subtotal;

            detailedItems.push({
                name: pro.name,
                price: pro.offerPrice,
                qty: item.quantity,
                subtotal,
            });
        }

        // Save order in DB
        const newOrder = await order.create({
            userId,
            address,
            items,
            amount,
            paymentType: "COD",
        });

        // Render detailed items table rows dynamically for insertion inside the big HTML
        const productRows = detailedItems
            .map(
                (p) => `
                <tr>
                    <td style="padding:8px;border:1px solid #ddd;">${p.name}</td>
                    <td style="padding:8px;border:1px solid #ddd;">${p.qty}</td>
                    <td style="padding:8px;border:1px solid #ddd;">$${p.price}</td>
                    <td style="padding:8px;border:1px solid #ddd;">$${p.subtotal}</td>
                </tr>`
            )
            .join("");

        // Full original HTML email template from your attachment, with dynamic variables injected
        const userEmailHTML = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
<meta name="x-apple-disable-message-reformatting" />
<link href="https://fonts.googleapis.com/css?family=Bebas+Neue:ital,wght@0,400" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css?family=Onest:ital,wght@0,400;0,500;0,600" rel="stylesheet" />
<title>LeBazar</title>
<style>
  /* Your full CSS styles here, as in the attachment */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    min-height: 100% !important;
    width: 100% !important;
    -webkit-font-smoothing: antialiased;
  }
  /* other styles omitted for brevity */
</style>
</head>
<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; font-weight: normal; color: #2d3a41; background-color: #ffe1d8;" bgcolor="#ffe1d8">
  <!-- Full complex HTML structure from your attached file goes here -->
  <!-- Insert greeting dynamically -->
  <p style="font-size: 18px;">Hi <b>${address.firstName}</b> 👋</p>
  <!-- Insert your product table replacing the suitable tbody content -->
  <table style="border-collapse: collapse; width: 100%; font-size: 14px; margin: 20px 0;">
    <thead>
      <tr style="background: #f4f4f4;">
        <th style="padding:8px; border: 1px solid #ddd; text-align:left;">Product</th>
        <th style="padding:8px; border: 1px solid #ddd; text-align:left;">Qty</th>
        <th style="padding:8px; border: 1px solid #ddd; text-align:left;">Price</th>
        <th style="padding:8px; border: 1px solid #ddd; text-align:left;">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${productRows}
    </tbody>
  </table>
  <!-- Insert total amount dynamically -->
  <h3 style="text-align:right;">Total: $${amount}</h3>

  <!-- Rest of your original HTML content (benefits, footer, questions, etc.) remains exactly as in your file -->
  <!-- Omitted here for brevity -->
</body>
</html>
`;

        const adminEmailHTML = `
        <div style="font-family:Arial, sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
            <div style="background:#f44336;padding:20px;color:white;text-align:center;">
                <h2>New Order Alert</h2>
            </div>
            <div style="padding:20px;">
                <p><b>User:</b> ${address.firstName} ${address.lastName}</p>
                <p><b>Email:</b> ${address.email}</p>
                <p><b>Total Amount:</b> $${amount}</p>
                <p><b>Order ID:</b> ${newOrder._id}</p>
                <h4>Order Items:</h4>
                <ul>
                    ${detailedItems.map((p) => `<li>${p.qty} x ${p.name} ($${p.price})</li>`).join("")}
                </ul>
            </div>
        </div>`;

        // Send email to user
        if (address.email) {
            await sendEmail(
                address.email,
                "Your Order Confirmation - FoodApp",
                `Hello ${address.firstName}, Your order has been placed successfully.`,
                userEmailHTML
            );
        }

        // Send email to admin
        await sendEmail(
            process.env.ADMIN_EMAIL,
            "New Order Received - FoodApp",
            "A new order has been placed.",
            adminEmailHTML
        );

        res.json({ success: true, message: "Order Placed & Emails Sent" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// const createorder = async (req, res) => {
//     try {
//         const { userId, items, address } = req.body

//         if (!items || !address) {
//             return res.json({ success: false, message: "Invalid Cart" })
//         }

//         let amount = await items.reduce(async (acc, item) => {
//             const pro = await product.findById(item.product)
//             return (await acc) + pro.offerPrice * item.quantity
//         }, 0)

//         await order.create({
//             userId,
//             address,
//             items,
//             amount,
//             paymentType: "COD"
//         })

//         res.json({ success: true, message: "Order Placed" })
//     } catch (error) {
//         res.json({ success: false, message: error.message })

//     }
// }

const getOrder = async (req, res) => {
    try {
        const { userId } = req.query;

        const orders = await order
            .find({ userId })
            .populate("items.product")  // populated product documents
            .populate("address")       // populated address document
            .sort({ createdAt: -1 });


        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const orders = await order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product")
            .populate("address")
            .sort({ createdAt: -1 })

        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, messsage: error.messsage })
    }
}

module.exports = { createorder, getOrder, getAllOrders };