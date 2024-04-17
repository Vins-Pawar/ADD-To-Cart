const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_image: {
        type: String,
    }
})

const product = mongoose.model('product', productSchema);

module.exports={product}