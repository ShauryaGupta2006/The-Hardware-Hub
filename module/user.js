const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/theHardwareHub")

const userSchema = mongoose.Schema({
    name: String,
    username : String,
    email : String,
    password : String,
    postId :[{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'post'
    }] 

    

})


module.exports = mongoose.model("UserDB",userSchema)