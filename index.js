const express = require('express')
const app = express()
const userdb = require("./module/user")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')

dotenv.config({path: './.env'})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname+'/public')))
app.set('view engine','ejs')
app.use(cookieParser())

app.get("/",(req,res)=>{

    res.render("index")

})

app.get("/create",(req,res)=>{
    res.render("createuser")
})

app.post("/create", async(req,res)=>{

    let{name,username,email,password} = req.body;

    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(req.body.password,salt,function(err,hash){
            let newuser = userdb.create({
                name,
                username,
                email,
                password:hash
            })
        })
    })
    let token = jwt.sign({email: req.body.email},"shhh")
    res.cookie("token",token)

    res.redirect("/")
})

// log in

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
                res.redirect('/profile')
            }
        })
    }
})

app.get("/profile",isLogin,(req,res)=>{

    res.send("Hello")

})

app.post('/logout',(req,res)=>{
    res.cookie("token","")
    res.redirect("/")
})


function isLogin(req,res,next){

    if(req.cookies.token === '') res.send("Please Login first")
    
    else{
        let data = jwt.verify(req.cookies.token,'shhh')
        req.user = data
        next()
    }

    jwt.verify("")

}


app.listen(process.env.PORT,()=>{
    console.log(`Server Initiated ${process.env.PORT}`)
})