const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const isAdmin = require("../middlewares/isAdmin.js")
const upload = require("../middlewares/multer.js")
const multer = require("multer")
const productdb = require("../models/product-model")


router.get("/",isAdmin,(req,res)=>{
    res.render("admin-dash.ejs")
})

router.get("/dashboard",isAdmin,(req,res)=>{
    res.render("admin-dash.ejs")
})



router.get("/listproduct",isAdmin,upload.single("productimage"),(req,res)=>{
    res.render("new-product")
})


router.post("/listproduct",upload.single("productimage"),async(req,res)=>{

    let {name,price,brand,description,quantity} = req.body;

    let product = productdb.create({
        name,
        price,
        brand,
        quantity,
        typee : req.body.type,
        description,
        image: req.file.filename
    })

    
    res.send("product created")
})



module.exports = router;
