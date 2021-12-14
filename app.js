const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv =require("dotenv")
dotenv.config()

//packages for sessions
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


//app.use code
const app = express() ;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

///////////////////////login sign-up session set-up starts here////////////////////////////////


app.use(session({
  secret : "this is a strong secret",
  resave : false,
  saveUninitialized :false
}));
app.use(passport.initialize());
app.use(passport.session());

///////////////////////login sign-up session set-up ends here////////////////////////////////

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex",true);
///////////////////////basic login sign-up pages starts here////////////////////////////////

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/register", function(req, res) {
  res.render("register");
});



app.post("/register", function(req, res) { 

  User.register({username:req.body.username}, req.body.password, function(err, user) {
    if (err) 
    {
      res.redirect("/regiter");
    }
    else{ 
      passport.authenticate("local")(req,res,function(){
        res.redirect("/contact");
      });
        
    }
    
  });
  });
  
app.get("/login", function(req, res) {
  res.render("login");
});


app.post("/login", function(req, res) {
 
  const user = new User({
    username : req.body.username,
     password : req.body.password
  });
  req.login(user,function(err)
  {
    if(err)
    {
      Console.log(err);
    }
    else
    {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/contact");
      });
    }

  });
});


app.get("/logout",function(req,res){
req.logout();
res.redirect("/");
});





////////////////////////contact schema starts here/////////////////////////////////////////////////////
const contactSchema = new mongoose.Schema({
  registration:{
    type: String,
    required: true,
    unique: true
   },
  session:{
    type: String,
    required: true
   },
  name: {
    type: String,
    required: true
   },
  email:{
    type: String,
    required: true,
    unique: true
   },
  phone: {
    type: String,
    required: true
   },
  hostel:String
});

 const Contact = mongoose.model("Contact", contactSchema);
/////////////////////// contact schema ends here/////////////////////////////////////////////////////


// get method starts here
app.get("/", function(req, res) {
      res.render("home");
});



app.get("/contact",function(req,res){
  if(req.isAuthenticated())
{
  res.render("contact");
}
else
{
  res.redirect("/login");
}
  
});

app.get("/fail",function(req,res){
  const contact= "Contact Us";
  res.render("fail", {pageName: contact});
});

app.get("/success",function(req,res){
  const contact= "Contact Us";
  res.render("success", {pageName: contact});
});



app.post("/contact", function(req, res)
 {

     var newContact = new Contact(
   {
    registration: req.body.registration,
    session: req.body.session,
    name : req.body.name,
    email : req.body.email,
    phone : req.body.phone,
    hostel: "Not Alloted"
   });
  

     newContact.save(function(err)
    {
      if (err || req.body.phone.length !=10 ) 
      { 
        res.render("fail");
      }
      else
      {
        res.render("success");
      }
   
  
     });
  
  });

app.get("/login",function(req,res){
  const blogpost = "Post";
  res.render("login", {pageName:blogpost});
});
///////////////////////////////////////////////////




app.get("/status",function(req,res){
        res.render("status");  
});

app.post("/status",function(req,res){

      Contact.find({registration : req.body.check}, function(err, foundList) {
        if (foundList.length !=0) 
        {
          console.log(foundList.length);
            res.render("status", {
             user : foundList[0]
              // pageName:blogpost
            });
         
        }

        
        else
        {
          console.log(foundList.length);
          res.render("fail");

        }
      });
    

   

});





app.get("/admin",function(req,res){
  if(req.isAuthenticated())
  {
    Contact.find({}, function(err, foundList) {
      if (!err) 
      {
        // console.log(foundList.length);
          res.render("admin", {
           users : foundList
            // pageName:blogpost
          });
      }
    });
  }
  else
  {
    res.redirect("/admin-login");
  } 
});


app.post("/admin",function(req,res){
 Contact.findByIdAndUpdate(req.body.idd, { hostel: req.body.hostel },
  function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated User : ", docs);
    }
});

  Contact.find({}, function(err, foundList) {
    if (!err) 
    {
      //console.log(foundList.length);
        res.render("admin", {
         users : foundList
          // pageName:blogpost
        });
    }
  });  
});


app.get("/home",function(req,res){
  res.render("home");
});

app.get("/HostelA",function(req,res){
        res.render("HostelA");
});

app.get("/HostelB",function(req,res){
  res.render("HostelB");
});

app.get("/HostelC",function(req,res){
  res.render("HostelC");
});

app.get("/HostelD",function(req,res){
  res.render("HostelD");
});

app.get("/HostelE",function(req,res){
  res.render("HostelE");
});

app.get("/HostelF",function(req,res){
  res.render("HostelF");
});

app.get("/HostelG",function(req,res){
  res.render("HostelG");
});

app.get("/HostelH",function(req,res){
  res.render("HostelH");
});

app.get("/HostelI",function(req,res){
  res.render("HostelI");
});

app.get("/HostelJ",function(req,res){
  res.render("HostelJ");
});

app.get("/HostelK",function(req,res){
  res.render("HostelK");
});

app.get("/Amb-Hostel",function(req,res){
  res.render("Amb-Hostel");
});

app.get("/RBL-Hostel",function(req,res){
  res.render("RBL-Hostel");
});





app.get("/register-admin",function(req,res){
   res.render("register-admin");
});


app.post("/register-admin",function(req,res){
 
  if(req.body.admincode === ADMIN_CODE)
  {
     
    User.register({username:req.body.username}, req.body.password, function(err, user) {
      if (err) 
      {
        res.redirect("/regiter");
      }
    
      else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/admin-login");
        });   
      }
    });
  }
  else
  {
    res.render("fail");
  }
 });


app.get("/admin-login",function(req,res){
  res.render("admin-login");
});

app.post("/admin-login", function(req, res) {
  if(req.body.admincode === "Admin@123")
  {     
    const user = new User({
      username : req.body.username,
       password : req.body.password
    });
    req.login(user,function(err)
    {
      if(err)
      {
        Console.log(err);
      }
      else
      {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/admin");
        });
      }  
    });
  }
  else
  {
    res.render("fail");
  }  
});


app.get("/hostelhome",function(req,res){
  res.render("hostelhome");
});


////////////////////////////////////////////////

app.listen(3000 || process.env.PORT, function(){
  console.log("Server started at port 3000.");
});
