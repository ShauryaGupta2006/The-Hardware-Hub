const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt')
const path = require('path');
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")

dotenv.config({
  path:'./.env'
})

const userdb =  require('./model/user-db') 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser())

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});


app.get("/createuser",(req,res)=>{

  res.render("createuser")

})

app.post("/create",(req,res)=>{
  
  let {name,phone_number,email,password} = req.body;

  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(password,salt, async function(err,hash){

      let user = await userdb.create({
        name,
        phone_number,
        email,
        password : hash
      })
    })
  })
  res.redirect("/")
})


app.get("/login",(req,res)=>{
  res.render("login")
})

app.post("/login",async(req,res)=>{

  let user = await userdb.findOne(({email: req.body.email}))

  if(!user) return res.send("No User")
  
  
  
  bcrypt.compare(req.body.password,user.password,function(err,result){
    if(result){
      let token = jwt.sign({email : user.email, role : user.role},"secreettt")

      res.cookie("token",token)
      res.redirect('/')

    }
    else{
      res.send("Something went wrong!!!!")
    }
  })
  


})
app.get("/profile",isLogin,(req,res)=>{
  res.send("hi")
})


// Middleware for the login

function isLogin(req,res,next){
  if(req.cookies.token === "") res.send("Please Login")

  else{
    // check karna padega jo cookie hai vo konsi hai exist karti hai ki nhi

    const decode = jwt.verify(req.cookies.token,"secreettt")

    req.user = decode;
  }

  next();
}

// Log Out Route
app.post('/logout',(req,res)=>{
  res.cookie("token","")
  res.redirect("/")

})

app.get("/profile",islogin,(req,res)=>{

  res.render("profile")


  
})

function islogin(req,res,next){
  if(req.cookies.token==="") res.send("Please Login")

  else{
    let data = jwt.verify(req.cookies.token,"secreettt")
    req.user = data
  }
  next()
}



app.listen(process.env.PORT, () => {
  console.log(`Server initiated`);
});