const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://HardwareHub:qwert@hardwarehub.pclj3wl.mongodb.net/?appName=HardwareHub")


.then(function(){
    console.log("Connected");
    
})

.catch(function(err){
    console.log(err);
    
});


module .exports = mongoose.connection;