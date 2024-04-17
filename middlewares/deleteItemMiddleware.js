const { model } = require("mongoose");
const{validUser}=require('../middlewares/validUser');

//checks user is logged in or not if user is loged in delete cart element from database else delete cart element from cookie
async function deleteItemMiddleware(req, res, next) {
    if (validUser(req,res)) {
        next();
    }
    else {
        const { productId } = req.body;
        // console.log(productId);
        const existingCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        console.log(productId);
        const index = existingCart.indexOf(productId);
        if (index !== -1) {
            existingCart.splice(index, 1);
        }
        const encodedCart = JSON.stringify(existingCart);
        res.cookie('cart', encodedCart, { maxAge: 86400000 });

        res.status(200).json({ message: 'Product removed from cart' });
    }
}

module.exports = { deleteItemMiddleware }