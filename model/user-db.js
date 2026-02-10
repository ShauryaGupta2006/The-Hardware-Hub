const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hardwarehub').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


const userSchema = new mongoose.Schema({
    name: String,
    phone_number: {
        type: String,
        minlength: 10,
        maxlength: 10,
        match: /^[0-9]{10}$/
    },
    email:{
        type: String,
        unique: true,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }, 
    role:{
        type: String,
        enum: ["User "|| "admin"],
        default: "user"
    },
    password: String
});

module.exports = mongoose.model('Users', userSchema);

