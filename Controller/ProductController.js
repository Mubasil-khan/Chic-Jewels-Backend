// ProductController.js
const product = require('../modal/product')
const cloudinary = require('cloudinary').v2

const addProduct = async (req, res) => {
    try {
        const images = req.files;

        const imageUrl = await Promise.all(
            images.map((item) =>
                cloudinary.uploader.upload(item.path, { resource_type: "image" })
            )
        );
        let productData = JSON.parse(req.body.productData);

        const newProduct = await product.create({
            ...productData,
            image: imageUrl.map((img) => img.secure_url),
        });

        return res.json({ success: true, message: "Product Added", product: newProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "issue", error: error.message });
    }
};

async function ProductList(req, res) {
    try {
        const products = await product.find({});
        return res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Product not display error " });
    }
}

const ProductById = async (req, res) => {
    try {
        const { id } = req.params; // ✅ use params, not body
        const foundProduct = await product.findById(id)
        if (!foundProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.json({ success: true, product: foundProduct })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message }) // ✅ fixed typo
    }
}

const ChangeStock = async (req, res) => {
    try {
        const { id, instock } = req.body;
        await product.findByIdAndUpdate(id, { instock });
        return res.json({ success: true, message: "Stock updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const BestSellers = async (req, res) => {
    try {
        const { id, BestSellers } = req.body;
        await product.findByIdAndUpdate(id, { BestSellers });
        return res.json({ success: true, message: "BestSellers updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { addProduct, ProductList, ChangeStock, ProductById, BestSellers }

