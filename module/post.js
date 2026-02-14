const mongoose = require("mongoose")
const user = require("./user")

mongoose.connect("mongodb://127.0.0.1:27017/theHardwareHub")

const userSchema = mongoose.Schema({
    name: String,
    username : String,
    email : String,
    password : String,
    userId :[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }] 
})


module.exports = mongoose.model("UserDB",userSchema)