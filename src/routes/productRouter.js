const express = require("express")
const router = express.Router()
const productdb = require("../models/product-model")

router.use(express.json())
router.use(express.urlencoded({extended:true}))

router.get("/", async (req,res)=>{

    let products = await productdb.find()
    res.render("products",{products:products})
})



module.exports = router;
