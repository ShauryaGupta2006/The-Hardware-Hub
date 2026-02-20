const jwt = require("jsonwebtoken")

const userdb = require("../models/user-model")

async function isAdmin(req, res, next) {

    let token = req.cookies.token
    if (!token) return res.redirect("/login")

    else {
        let data = jwt.verify(req.cookies.token, "shhh")
        req.user = data

        const user = await userdb.findOne({ email: data.email });

        if (!user || user.role !== "admin") {
            return res.send("You are not authorized to access this page");
        }

        else {
            next()
        }

    }




}

module.exports = isAdmin
