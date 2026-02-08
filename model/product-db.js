const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hardwarehub').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


const productSchema = new mongoose.Schema({
    product_name: String,
    pricing: Number,
    Description: String
});

module.exports = mongoose.model('Product', productSchema);

