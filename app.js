var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override")
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Blog     = require("./models/blog"),
    User        = require("./models/user"),
    Comment     = require("./models/comment"),
    middleware = require("./middleware");

    var commentRoutes    = require("./routes/comments");

mongoose.connect("mongodb://blogu:blogu@ds123259.mlab.com:23259/blogu", {useMongoClient: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again you wins!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/blogs/:id/comment", commentRoutes);





app.get("/",function (req,res) {
  res.redirect("/blogs");
});

app.post("/blogs",function(req,res) {
  // add author to blog
  req.body.blog.author = {
    id: req.user._id,
    username: req.user.username
  }
Blog.create(req.body.blog,middleware.isLoggedIn,function (err,newBlog) {
    if(err){
          res.render("new");
    }else{
     res.redirect('/blogs');

    }
  });
});
app.get("/blogs/person",function (req,res) {
  res.render("person.ejs");
});
app.get("/blogs/person/addjob",function (req,res) {
  res.render("addp1.ejs");
});
app.get("/blogs/person/addedu",function (req,res) {
  res.render("addp2.ejs");
});

app.delete("/blogs/:id",function (req,res) {
  Blog.findByIdAndRemove(req.params.id,function(err,updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id/edit",function (req,res) {
  Blog.findById(req.params.id, function (err, foundblog) {
    if (err) {
      console.log(err);
    } else{
      res.render("edit",{blog:foundblog});
    }
  });

});

app.put("/blogs/:id",function (req,res) {
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

app.get("/blogs",function (req,res) {
  Blog.find({},function(err, blogs){
    if(err){
      console.log(err);
    }else{
     res.render("index",{blogs:blogs});
    }
  });

});


app.get("/blogs/new",middleware.isLoggedIn,function (req,res) {
  res.render("new.ejs");
});

app.get("/blogs/login",function (req,res) {
  res.render("login");
});
//handling login logic
app.post("/blogs/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/blogs/logout", function(req, res){
   req.logout();
   res.redirect("/blogs");
});

app.get("/blogs/signup",function (req,res) {
  res.render("signup");
});
//handle sign up logic

app.post("/blogs/signup", function(req, res){
    var newUser = new User({username: req.body.username, fullname: req.body.fullname, email: req.body.email, mobile:req.body.mobile});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/blogs");
        });
    });
});

app.get("/blogs/:id",function (req,res) {
  Blog.findById(req.params.id).populate("comments").exec(function(err, foundblog){
    if (err) {
      console.log(err);
    } else{
      res.render("show",{blog:foundblog});
    }
  });

});





app.listen(3000,function(){
  console.log("blog server started at 3000");
});
