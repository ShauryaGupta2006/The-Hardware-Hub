const mongoose = require("mongoose")



const userSchema = mongoose.Schema({
    name: String,
    username : String,
    email : String,
    password : String,

    cart : [{
        type : Array,
        default : []
    }]
    
})


module.exports = mongoose.model("UserDB",userSchema)