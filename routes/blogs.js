var express = require("express");
var router  = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var User = require("../models/user");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//profile routes
router.get("/person",function (req,res) {
  res.render("person.ejs");
});
router.get("/person/addjob",function (req,res) {
  res.render("addp1.ejs");
});
router.get("/person/addedu",function (req,res) {
  res.render("addp2.ejs");
});

router.put("/person/:id",function (req,res) {
  console.log("1step");
  User.findByIdAndUpdate(req.params.id,req.body.user,function(err,updatedUser) {
    if (err) {
      console.log(err);
      res.redirect("/blogs/person");
    }else{
      console.log("added");
      res.redirect("/blogs/person");
    }
  });
});

router.get("/",function (req,res) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Blog.find({title:regex},function(err, blogs){
      if(err){
        console.log(err);
      }else{
       res.render("index",{blogs:blogs});
      }
    });

  }
  else if (req.query.link) {
    const regex = new RegExp(escapeRegex(req.query.link), 'gi');
    Blog.find({cat:regex},function(err, blogs){
      if(err){
        console.log(err);
      }else{
       res.render("index",{blogs:blogs});
      }
    });

  }
   else {
    Blog.find({},function(err, blogs){
      if(err){
        console.log(err);
      }else{
       res.render("index",{blogs:blogs});
      }
    });
  }
  });

router.post("/",function(req,res) {
  // add author to blog
  console.log("text");
  req.body.blog.author = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    mobile: req.user.mobile,
    fullname: req.user.fullname,
    followers: req.user.followers,
    following: req.user.following
  }
Blog.create(req.body.blog,middleware.isLoggedIn,function (err,newBlog) {
    if(err){
          res.redirect('/blogs');
    }else{
     res.redirect('/blogs');

    }
  });
});


router.delete("/:id",function (req,res) {
  Blog.findByIdAndRemove(req.params.id,function(err,updatedBlog) {
    if (err) {
        res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});

router.get("/:id/edit",function (req,res) {
  Blog.findById(req.params.id, function (err, foundblog) {
    if (err) {
      console.log(err);
    } else{
      res.render("edit",{blog:foundblog});
    }
  });

});

router.put("/:id",function (req,res) {
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});




router.get("/new",middleware.isLoggedIn,function (req,res) {
  res.render("new.ejs");
});

router.get("/:id",function (req,res) {
  Blog.findById(req.params.id).populate("comments").exec(function(err, foundblog){
    if (err) {
      console.log(err);
    } else{
      res.render("show",{blog:foundblog});
    }
  });

});

router.get("/author/:id",function (req,res) {
  Blog.findById(req.params.id).populate("").exec(function(err, foundblog){
    if (err) {
      console.log(err);
    } else{
      res.render("profview",{blog:foundblog});
    }
  });

});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup blog using ID

   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
        Comment.create(req.body, function(err, comment){
           if(err){
 console.log("test");
               console.log(err);
           } else {
               //add username and id to comment
               comment.text = req.body.comment.text;
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();

                console.log(req.user.username);
                  //Blog.comments.push();
      Blog.findByIdAndUpdate(
       { _id : req.params.id},
       {$push: {comments  : {text: req.body.comment.text,author:comment.author}}},
       {safe: true, upsert: true},
       function(err, model) {
       console.log(err);
       console.log("test3");
});
               console.log(comment);

               res.redirect('/blogs/' + blog._id);
           }
        });
       }
   });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
