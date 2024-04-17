const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product_id: {
        type: String
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    // product_name: {
    //     type: String
    // },
    // product_price: {
    //     type: Number
    // },
    // product_image: {
    //     type: String
    // },
    product_qunatity: {
        type: Number
    }
})

const Cart = mongoose.model('cart', cartSchema);
module.exports={Cart}