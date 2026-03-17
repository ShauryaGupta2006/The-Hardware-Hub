const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const user = require("../models/user-model");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv')
// const checkCart = require("./src/middlewares/checkcart")

router.use(cookieParser());

router.get("/", (req, res) => {
    res.redirect("/user/profile");
});

router.get("/profile", async (req, res) => {
    try {

        if (!req.cookies.token) {
            return res.redirect("/user/login");
        }

        const decoded = jwt.verify(
            req.cookies.token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        const cartCount = req.session?.cart
            ? req.session.cart.length
            : 0;

        res.render("profile", {
            user,
            cartCount
        });

    } catch (err) {
        console.log(err);
        return res.redirect("/login");
    }
});

router.get("/checkout", async (req, res) => {

    try {
        const token = req.cookies.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const useri = await user.findById(decoded.id);


        

        res.render("checkout", { useri });

    } catch (err) {
        console.log(err)
        // res.redirect("/user/login");
    }

});
router.get("/:userid/orders",(req,res)=>{

    res.render("oders",{user})
})

// router.get("/:userid/")

module.exports = router;