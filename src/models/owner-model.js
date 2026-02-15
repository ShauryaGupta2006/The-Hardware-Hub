moongoose.Schema({
    name: String,
    email: String,
    products: [{
        type: Array,
        default: []
    }]
})