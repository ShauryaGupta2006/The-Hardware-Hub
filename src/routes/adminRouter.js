const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const isAdmin = require("../middlewares/isAdmin.js")


router.get("/",isAdmin,(req,res)=>{
    res.render("admin-dash.ejs")
})




router.get("/listproduct",isAdmin,(req,res)=>{
    res.render("new-product")
})



module.exports = router;
