var express = require("express");
var router  = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find blog by id
    console.log(req.params.id);
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        } else {
             res.render("anew", {blog: blog});
        }
    })
});


// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/blogs/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

// Comment on Answers
router.post("/:id/answercom",middleware.isLoggedIn,function(req, res){
   //lookup blog using ID

   Blog.comment.find(function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } if(err){
 console.log("test");
               console.log(err);
           } else {
               //add username and id to comment
               comment.text = req.body.text;
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();

                console.log(req.user.username);
                  //Blog.comments.push();
      Blog.findByIdAndUpdate(
       { _id : req.params.id},
       {$push: {comments  : {comment:{text: req.body.comment.text,author:comment.author}}}},
       {safe: true, upsert: true},
       function(err, model) {
       console.log(err);
       console.log("test3");
});
               console.log(comment);

               res.redirect('/blogs/' + blog._id);


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


module.exports = router;
