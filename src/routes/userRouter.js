const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const cookieParser = require("cookie-parser");

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

module.exports = router;