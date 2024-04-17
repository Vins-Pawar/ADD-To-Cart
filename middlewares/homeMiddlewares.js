const {Cart}=require('../models/cart')
const{validUser}=require('../middlewares/validUser');

//berfore going to home page check user is logged in or not if user is logged in store all cart items of user from cookie to database and clear cart cookie and render home page
async function storeCookieData(req, res, next) {
    if (validUser(req,res)) {
        const userId=req.session.userSessionId;
        const productIds = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        // console.log("productIds " + productIds);
        try {

            for (const productId of productIds) {
                // console.log("productId " + productId);
                const itemExists = await Cart.find({ product_id: productId , user_id:userId})
                // console.log("itemExists " + itemExists);
                if (!itemExists.toString()) {
                    // console.log("Adding.....");
                    const cartItem = await Cart.create({ product_id: productId, user_id:userId,product_qunatity: 1 });
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