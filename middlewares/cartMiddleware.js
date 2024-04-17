const {product}=require('../models/product')
const{validUser}=require('../middlewares/validUser');

//checks user loged in or not if logeed in show all cart item from database else show cart items from cookie
async function cartMiddleware(req, res, next) {
    if (validUser(req,res)) {
        next();
    } else {
        // console.log(req.cookies.cart);
        const cartElements = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
        // console.log("cartelements " + cartElements);
        // console.log(typeof cartElements.toString());
        const products = [];

        const ele = cartElements.toString().split(',').map(element => element.trim());
        // console.log(ele);
        for (const element of ele) {
            // console.log(element);
            try {
                const item = await product.find({ product_id: element });
                // console.log(item[0]);
                if (item[0]) {
                    products.push(item[0]);
                }
            } catch (error) {
                console.log("Error " + error);
            }
        }
        // console.log(products);
        return res.json(products);
    }
}

module.exports={cartMiddleware}
