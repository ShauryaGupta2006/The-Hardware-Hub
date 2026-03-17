const express = require("express")
const router = express.Router()
const productdb = require("../models/product-model")
const userdb = require("../models/user-model")
const userid = require("../middlewares/userid")
router.use(express.json())
router.use(express.urlencoded({extended:true}))
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
const mongoose = require('mongoose')

// router.get("/", async (req,res)=>{

//     let products = await productdb.find()
//     res.render("products",{products:products})
// })



router.get("/", async(req, res) => {

    let products = await productdb.find()
    res.render("products",{products})
})

// {token:req.cookies.token}



router.post("/remove/:productid", userid, async (req, res) => {
    try {

        const productId = req.params.productid

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send("Invalid Product ID")
        }

        await userdb.findByIdAndUpdate(
            req.user.id,
            { $pull: { cart: productId } }
        )

        res.redirect("/cart")

    } catch (err) {
        console.log(err)
        res.status(500).send("Error removing item")
    }
})



router.get("/:id",async (req,res)=>{

    

    try{
        const product = await productdb.findById(req.params.id)

        if(!product){
            return res.send("No Product")

        } 
    

    res.render("item",{product: product})

    }
    catch{
        res.send("Something Went Wrong")

    }
    
});


router.post("/addtocart/:id",userid,async(req,res)=>{

    try {
        const product = await productdb.findById(req.params.id);

        if(product.quantity === 0){
            res.send("No Available stock ")
        }

        else{

            // console.log("Decoded user",req.user)
            const user = await userdb.findById(req.user.id)



            user.cart.push(product._id)
            await user.save()
            res.status(200).send("Added to cart")
        }



    }catch(error){
        console.log(error)
        res.status(500).send("Something Went Wrong")
    }

})






// router.post("/updateQuantity/:id", async (req, res) => {
//     const productId = req.params.id;
//     const action = req.body.action;

//     const token = req.cookies.token;
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await userdb.findById(decoded.id);

//     const item = user.cart.find(
//         item => item.product.toString() === productId
//     );

//     if (!item) return res.redirect("/cart");

//     if (action === "increase") {
//         item.quantity += 1;
//     } else if (action === "decrease") {
//         item.quantity -= 1;

//         if (item.quantity <= 0) {
//             user.cart = user.cart.filter(
//                 item => item.product.toString() !== productId
//             );
//         }
//     }

//     await user.save();

//     res.redirect("/cart");
// });









module.exports = router;
