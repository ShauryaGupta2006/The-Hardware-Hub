const express = require('express')
const app = express()
const userdb = require("./src/models/user-model")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const db = require("./src/confiig/mongodb-connect")
const productdb = require("./src/models/product-model")
const userRouter = require("./src/routes/userRouter")
const adminRouter = require("./src/routes/adminRouter")
const productRouter = require("./src/routes/productRouter")
const userid = require("./src/middlewares/userid")


dotenv.config({ path: '/Users/shaurya/Desktop/Base Directory/Projects/The-Hardware-hub-Project/.env' })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static("images"))
app.use(express.static(path.join(__dirname+'/src/public')))
app.set('view engine', 'ejs')
app.use(cookieParser())



const cloudinary = require("cloudinary").v2


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/products", productRouter)



app.get("/",async (req, res) => {
    let token = req.cookies.token

    if(!token){
        res.redirect("/login")
    }


    else{
        try{
        let data = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userdb.findById(data.id)
        const featuredProducts = await productdb
            .find()
            .sort({ createdAt: -1 })   // newest first
            .limit(3);

            
        res.render("index", {
            user,
            cartCount: user?.cart?.length || 0,
            featuredProducts
        });


        }catch(err){
            res.redirect("/login")
        }
    }
})





app.get("/signup",(req,res)=>{
    res.render("signup")
})




app.post("/signup", async (req, res) => {
    try {
        let { name, username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userdb.create({
            name,
            username,
            email,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
        );

        res.cookie("token", token);
        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.send("Error creating user");
    }
});


app.get("/cart", async (req, res) => {
    try {
        const token = req.cookies.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userdb
            .findById(decoded.id)
            .populate("cart");

        if (!user) {
            return res.send("No such user");
        }

        // ✅ send only cart products
        res.render("cart", { products: user.cart });

    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
});

app.get("/login",(req,res)=>{
    res.render('login')
})




app.post("/login",async(req,res)=>{

    let user = await userdb.findOne({email : req.body.email})

    if(!user) return res.status(404).send("No User exist")

    else{

        let userpass = req.body.password

        bcrypt.compare(userpass,user.password,function(err,result){
            if(!result) return res.send("Wrong Passcode")
            if(result){

                let token = jwt.sign({id: user._id,email: req.body.email},process.env.JWT_SECRET)
                res.cookie("token",token)
                res.redirect('/')
            }
        })
    }
})


app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
})





app.listen(process.env.PORT, () => {
    console.log(`Server Initiated ${process.env.PORT    }`)
});