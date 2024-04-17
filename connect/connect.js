const mongoose=require('mongoose');

const connection=mongoose.connect("mongodb://127.0.0.1:27017/E-Store")
    .then(() => { console.log("mongodb connection sucessful") })
    .catch((err) => { console.log("Error in connection " + err); })

module.exports={connection}