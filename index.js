const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt')
const path = require('path');

const userdb =  require('./model/user-db') 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

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

  bcrypt.genSalt(10,"",function(err,salt){
    bcrypt.hash(userdb.password,salt, async function(err,hash){

      let user = await userdb.create({
        name,
        phone_number,
        email,
        password : hash
      })
    })
  })

  
})

app.listen(port, () => {
  console.log(`Server initiated`);
});