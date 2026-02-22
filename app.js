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

dotenv.config({ path: '/Users/shaurya/Desktop/permits/projects/The-Hardware-hub-Project/.env' })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname+'/public')))
app.set('view engine', 'ejs')
app.use(cookieParser())




app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/products", productRouter)



app.get("/", (req, res) => {
    let token = req.cookies.token

    if(!token){
        res.redirect("/login")
    }


    else{
        try{
        let data = jwt.verify(token,"shhh")
        const user = userdb.findById(data.id)
        res.render("index",{token:user.token,user})
        }catch(err){
            res.redirect("/login")
        }
    }
})





app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup", async (req, res) => {

    let { name, username, email, password } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            let newuser = userdb.create({
                name,
                username,
                email,
                password: hash
            })
        })
    })
    let token = jwt.sign({ id: user._id,email: req.body.email }, "shhh")
    res.cookie("token", token)

    res.redirect("/")
})

// Cart Route


app.get("/cart",async(req,res)=>{
    let data = jwt.verify(req.cookies.token,"shhh")
    // req.user = data
    const user = await userdb.findById(data.id).populate("cart")

    if(!user){
        res.send("Sorry Their is no such user")
    }

    else{

        res.render("cart",{user})
    }

    console.log(data)
    // res.render("cart",{user})
})







app.post("/removeitem/:productid",async(req,res)=>{

    let token = req.cookies.token
    let data1 = jwt.verify(token,"shhh")

    const user = await userdb.findById(data1.id)

    let data = await userdb.findByIdAndUpdate(user._id,{ $pull: { cart: req.params.productid } });
    req.redirect('/cart')
})








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

                let token = jwt.sign({id: user._id,email: req.body.email},"shhh")
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
    console.log(`Server Initiated ${process.env.PORT}`)
});

