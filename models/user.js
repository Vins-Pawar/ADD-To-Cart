const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
})

//model
const user = mongoose.model("user", userSchema);

module.exports={user}