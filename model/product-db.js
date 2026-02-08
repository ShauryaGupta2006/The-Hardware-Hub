const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hardwarehub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


const productSchema = new mongoose.Schema({
    product_name: String,
    pricing: numeric,
    Description: String
});

module.exports = mongoose.model('Product', productSchema);

