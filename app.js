const express = require('express')
const app = express()
const userdb = require("./src/models/user-model")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const db = require("./src/confiig/mongodb-connect")

const userRouter = require("./src/routes/userRouter")
const adminRouter = require("./src/routes/adminRouter")
const productRouter = require("./src/routes/productRouter")

dotenv.config({ path: '/Users/shaurya/Desktop/permits/projects/The-Hardware-hub-Project/.env' })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname+'/public')))
app.set('view engine', 'ejs')
app.use(cookieParser())




app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/product", productRouter)



app.get("/", (req, res) => {
    res.render("index",{token:req.cookies.token})
})

app.get("/products", (req, res) => {
    res.render("products",{token:req.cookies.token})
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
    let token = jwt.sign({ email: req.body.email }, "shhh")
    res.cookie("token", token)

    res.redirect("/")
})





app.get("/login",(req,res)=>{
    res.render('login')
})

app.post("/login",async(req,res)=>{

    let user = await userdb.findOne({email : req.body.email})

    if(!user) return res.send("No User exist")

    else{

        let userpass = req.body.password

        bcrypt.compare(userpass,user.password,function(err,result){
            if(!result) return res.send("Wrong Passcode")
            if(result){

                let token = jwt.sign({email: req.body.email},"shhh")
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










// app.get("/",(req,res)=>{

//     res.render("index")

// })



// // log in



// app.get("/profile",isLogin,(req,res)=>{

//     res.send("Hello")

// })



// app.post('/logout',(req,res)=>{
//     res.cookie("token","")
//     res.redirect("/")
// })


// function isLogin(req,res,next){

//     if(req.cookies.token === '') res.send("Please Login first")

//     else{
//         let data = jwt.verify(req.cookies.token,'shhh')
//         req.user = data
//         next()
//     }

//     jwt.verify("")

// }


// app.listen(process.env.PORT,()=>{
//     console.log(`Server Initiated ${process.env.PORT}`)
// })

app.listen(process.env.PORT, () => {
    console.log(`Server Initiated ${process.env.PORT}`)
});

