const mongoose = require("mongoose")


const productSchema = mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    quantity: Number,
    image: String,
    description: String,
    
})


module.exports = mongoose.model("productSchema", productSchema)