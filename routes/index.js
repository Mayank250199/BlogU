var express = require("express");
var router  = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var User = require("../models/user");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.post('/follow-user/:id1/:id2', function(req, res, next) {
  console.log("f0");
  User.findById(req.params.id1,{username: req.body.username}, function(err, user) {

    user.followers.push(req.user._id);
    var followedUser = user._id;
    user.save(function(err){
        if(err){
            //Handle error
            console.log(err);
            //send error response
            res.redirect("/blogs/author/<%=blog._id%>");
        }
        else
        {
          console.log("f1");
            // Secondly, find the user account for the logged in user
            User.findById(req.params.id2,{ username: req.user.username }, function(err, user) {

                user.following.push(followedUser);
                user.save(function(err){
                    if(err){
                        //Handle error
                        console.log(err);
                        //send error response
                          res.redirect("/blogs/author/<%=blog._id%>");
                    }
                    else{
                      console.log("following");
                        res.redirect("/blogs/author/<%=blog._id%>");
                        //send success response

                    }
                });
            });
        }
    });
});
});


router.get("/blogs/login",function (req,res) {
  res.render("login");
});
//handling login logic
router.post("/blogs/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/blogs/logout", function(req, res){
   req.logout();
   res.redirect("/blogs");
});

router.get("/blogs/signup",function (req,res) {
  res.render("signup");
});
router.get("/:id/comments",function (req,res) {
  Comment.find({id:req.params.id},function(err, comments){
    if(err){
      console.log(err);
    }else{
     res.render("answer",{comments:comments});
    }

});
});
//handle sign up logic

router.post("/blogs/signup", function(req, res){
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



module.exports = router;
