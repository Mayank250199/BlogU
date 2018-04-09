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







app.listen(3000,function(){
  console.log("blog server started at 3000");
});
