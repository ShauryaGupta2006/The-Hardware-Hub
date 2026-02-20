const express = require("express")
const router = express.Router()
const productdb = require("../models/product-model")
const userdb = require("../models/user-model")
const userid = require("../middlewares/userid")
router.use(express.json())
router.use(express.urlencoded({extended:true}))
const jwt = require("jsonwebtoken")

// router.get("/", async (req,res)=>{

//     let products = await productdb.find()
//     res.render("products",{products:products})
// })



router.get("/", async(req, res) => {

    let products = await productdb.find()
    res.render("products",{products})
})

// {token:req.cookies.token}


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

module.exports = router;
