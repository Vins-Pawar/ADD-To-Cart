const { validUser } = require('../middlewares/validUser');

async function addToCartMiddleWare(req, res, next) {
    if (validUser(req, res)) {
        // console.log("userd is loged In");
        next();
    } else {
        // console.log("userd is not loged In");
        try {
            const { productId } = req.body;
            // console.log("productId " + productId);
            const productcart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
            if (!productcart.includes(productId)) {
                productcart.push(productId);
                // console.log("productcart " + productcart);
                const encodedCart = JSON.stringify(productcart);
                // console.log("encodedCart" + encodedCart);
                res.cookie('cart', encodedCart, { maxAge: 86400000 }); // Expires in 1 day (86400000 milliseconds)
            } else {
                console.log("Product already exists in the cart.");
            }

            return res.status(200).json(req.cookies.cart);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // next();
    }
}

module.exports = { addToCartMiddleWare }