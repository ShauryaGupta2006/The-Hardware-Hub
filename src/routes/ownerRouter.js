const express = require("express")
const router = express.Router()


router.get("/",(req,res)=>{
    res.send("Owner")
})


router.get("/listProduct",(req,res)=>{
    res.render("new-product")
})
module.exports = router;
