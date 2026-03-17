function checkCart(req, res, next) {

    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect("/cart"); // or send error
    }

    next(); // allow access
}

module.export = checkCart