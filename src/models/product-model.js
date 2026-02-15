const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    productname: String,
    Brand: String,
    Price: Number,
    // password: String,
    
})


module.exports = mongoose.model("UserDB", userSchema)