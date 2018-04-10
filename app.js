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
    middleware = require("./middleware"),
  commentRoutes    = require("./routes/comments"),
    blogRoutes    = require("./routes/blogs"),
    personRoutes    = require("./routes/person"),
    indexRoutes    = require("./routes/index");

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


app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/person", personRoutes);
app.use("/blogs/:id/comment", commentRoutes);

app.get("/",function (req,res) {
  res.redirect("/blogs");
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
app.get("/:id/comments",function (req,res) {
  Comment.find({id:req.params.id},function(err, comments){
    if(err){
      console.log(err);
    }else{
     res.render("answer",{comments:comments});
    }

});
});
//handle sign up logic

app.post("/blogs/signup", function(req, res){
    var newUser = new User(
      {username: req.body.username,
         fullname: req.body.fullname,
          email: req.body.email,
           mobile:req.body.mobile,
           experience: req.body.experience,
              company: req.body.company,
               position: req.body.position,
                school:req.body.school,
                concentration:req.body.concentration,
                secondaryc:req.body.secondaryc,
                degree:req.body.degree,
                graduation:req.body.graduation
         });

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

app.put("/blogs/person/:id",function (req,res) {
  console.log("1step");
  User.findByIdAndUpdate(req.params.id,req.body.user,function(err,updatedBlog) {
    if (err) {
      res.redirect("/blogs/person");
        console.log("1step");
    }else{
      res.redirect("/blogs/person");
    }
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
app.get("/blogs/author/:id",function (req,res) {
  Blog.findById(req.params.id).populate("").exec(function(err, foundblog){
    if (err) {
      console.log(err);
    } else{
      res.render("profview",{blog:foundblog});
    }
  });

});



app.listen(3000,function(){
  console.log("blog server started at 3000");
});
