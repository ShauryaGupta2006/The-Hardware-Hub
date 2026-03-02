const jwt = require("jsonwebtoken")
const userdb = require("../models/user-model")
const dotenv = require('dotenv')

function userid(req, res, next) {

    let token = req.cookies.token
    if (!token) return res.redirect("/login")

    try {
        let data = jwt.verify(req.cookies.token,process.env.JWT_SECRET)
        req.user = data
        next()
    } catch{

        res.redirect("/login")
    }
}

module.exports = userid
