const express = require("express")
const router = express.Router()


router.get("/",(req,res)=>{
    res.send("product")
})

router.post("/create",(req,res)=>{

    let {name,price,description,image} = req.body;

    let product = productdb.create({
        name,
        price,
        description,
        image
    })

    
    res.send("product created")
})

module.exports = router;
