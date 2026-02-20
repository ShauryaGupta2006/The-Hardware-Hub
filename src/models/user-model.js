const mongoose = require("mongoose")



const userSchema = mongoose.Schema({
    name: String,
    username : String,
    email : String,
    password : String,
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    },

    cart : [{
        type : mongoose.Schema.Types.ObjectId,
        default : [],
        ref : "productSchema"
    }]
    
})


module.exports = mongoose.model("UserDB",userSchema)