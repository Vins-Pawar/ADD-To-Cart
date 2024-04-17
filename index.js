const express = require('express');
const path = require("path");
const render = require('ejs');
const body = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { type } = require('os');
const { Session } = require('inspector');
const { connection } = require('./connect/connect')

//schemas
const { user } = require('./models/user')
const { product } = require('./models/product')
const { Cart } = require('./models/cart')


const app = express();

//middleware
app.use(express.json())//for json request
app.use(express.urlencoded({ extended: false })) //for form data request
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
}));
app.use(cookieParser());

//ejs middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, 'public')));

//custom middlewares
const { storeCookieData } = require('./middlewares/homeMiddlewares')
const { addToCartMiddleWare } = require('./middlewares/addToCartMiddleWare')
const { cartMiddleware } = require('./middlewares/cartMiddleware')
const { deleteItemMiddleware } = require('./middlewares/deleteItemMiddleware')
const { validUser } = require('./middlewares/validUser');
const { log } = require('console');

app.get('/', storeCookieData, async (req, res) => {
    try {
        const allproducts = await product.find({});
        return res.render('home', { products: allproducts });
    } catch (err) {
        return res.end("error")
        // console.log("error " + err);
    }
})

app.get('/login', (req, res) => {
    return res.render("loginpage");
})

app.post('/login/auth', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await user.findOne({ email, password });

        if (!result) {
            // return res.status(404).json({ msg: "Wrong email or password" });
            return res.render("login", { msg: "Wrong email or password" });
        }
        // res.status(200).json({ msg: "User found successfully" });
        req.session.userSessionId = result._id;
        res.cookie('userCookieId', result._id, { maxAge: 900000, httpOnly: true });

        // console.log(req.session.userSessionId+" "+req.cookie.userCookieId)
        return res.redirect('/');
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/signup', (req, res) => {
    return res.render('signup')
})

app.post('/signup/store', async (req, res) => {
    const { email, password, fname, lname } = req.body;
    const result = await user.create({
        fname,
        lname,
        email,
        password
    })
    // console.log(result);
    //setting userid in session and cookie
    req.session.userSessionId = result._id;
    res.cookie('userCookieId', result._id, { maxAge: 900000, httpOnly: true });
    // return res.status(200).json({ msg: "Susessful records insertion" });
    res.redirect('/');
})


app.post('/add-to-cart', addToCartMiddleWare, async (req, res) => {
    const { productId } = req.body;
    // console.log("cookie clear ", productId);
    if (productId) {
        const item = await product.find({ product_id: productId });
        // console.log(item);
        if (item[0]) {
            const alreadyPresent = await Cart.find({ product_id: productId });
            if (!alreadyPresent.toString()) {
                const cartItem = await Cart.create({ product_id: productId, product_qunatity: 1 });
            }
            // console.log("Product added to cart:", cartItem);
        }
    }
    // console.log("cookires in middleware " + req.cookies.cart);
    // delete req.body.productId;
    return res.end();
});



app.get('/cart', cartMiddleware, async (req, res) => {
    try {
        const cartItems = await Cart.find({});
        const searchResults = [];
        for (const item of cartItems) {
            const p = await product.findOne({ product_id: item.product_id });
            if (p) {
                searchResults.push(p);
            }
        }
        console.log("searchResults ");
        // console.log(res.json(searchResults));
        return res.json(searchResults);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/deleteFromCart', deleteItemMiddleware, async (req, res) => {
    const { productId } = req.body;
    console.log(productId);
    try {
        const result = await Cart.deleteMany({ product_id: productId });
        // console.log(result);
        if (result.deletedCount > 0) {
            console.log(`Successfully deleted ${result.deletedCount} item(s) from the cart.`);
        } else {
            console.log('No items found with the given product ID.');
        }
    } catch (error) {
        console.error('Error deleting items from the cart:', error);
    }
    return res.end();
})

app.get('/checkoutpage', async (req, res) => {
    try {
        const cartItems = await Cart.find({});
        const allCartItems = [];
        for (const item of cartItems) {
            const p = await product.findOne({ product_id: item.product_id });
            if (p) {
                allCartItems.push(p);
            }
        }
        // console.log("allCartItems " );
        res.render('checkoutpage', { cartItems: allCartItems });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})
app.get("/checkOut", storeCookieData, async (req, res) => {
    // console.log("i am in checkOut");
    if (validUser(req, res)) {
        // console.log("logged in");
        return res.redirect('checkoutpage')
        //  return res.status(400).json({msg:'notlogedin'})
    }
    else {
        // console.log("not logged in");
        return res.redirect('login?msg="Please sign in for further process"');
        // return res.status(200).json({msg:'logedin'})
    }
})

//api for inserting new  products in database
app.post("/products", async (req, res) => {
    const { product_id, product_name, product_price, product_image } = req.body;
    // console.log(`${product_id} ${product_name} ${product_price} ${product_image}`);
    try {
        await product.create({
            product_id,
            product_name,
            product_price,
            product_image
        });
        return res.status(200).json({ msg: "Successfully  product inserted" });
    } catch (error) {
        console.error('Error inserting product:', error);
        return res.status(500).json({ error: 'server error' });
    }
})


//api gives all products
app.get("/products", async (req, res) => {
    try {
        const allProducts = await product.find({});
        console.log("allproducts " + allProducts);
        // return res.send('home',{products:allproducts});
        return res.json(allProducts);
    } catch (err) {
        console.log("error " + err);
    }
})


const PORT = process.env.PORT || 8001; // Change the port number to 8081 or any other available port
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});