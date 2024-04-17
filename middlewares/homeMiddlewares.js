const {Cart}=require('../models/cart')
const{validUser}=require('../middlewares/validUser');

async function storeCookieData(req, res, next) {
    if (validUser(req,res)) {
        const productIds = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        // console.log("productIds " + productIds);
        try {

            for (const productId of productIds) {
                // console.log("productId " + productId);
                const itemExists = await Cart.find({ product_id: productId })
                // console.log("itemExists " + itemExists);
                if (!itemExists.toString()) {
                    // console.log("Adding.....");
                    const cartItem = await Cart.create({ product_id: productId, product_qunatity: 1 });
                    // console.log("Product added to cart: " + cartItem);
                }

            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
        res.clearCookie('cart');
        next();
    } else {
        next();
    }
}

module.exports={storeCookieData};