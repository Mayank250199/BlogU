var express = require("express");
var router  = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var User = require("../models/user");
var Comment = require("../models/comment");
var middleware = require("../middleware");





router.get("/",function (req,res) {
  res.render("person.ejs");
});
router.get("/addjob",function (req,res) {
  res.render("addp1.ejs");
});
router.get("/addedu",function (req,res) {
  res.render("addp2.ejs");
});

router.put("/:id",function (req,res) {
  console.log("1step")
  User.findByIdAndUpdate(req.params.id,req.body.user,function(err,updatedUser) {
    if (err) {
      res.redirect("/blogs/person");
    }else{
      res.redirect("/blogs/person");
    }
  });
});


module.exports = router;
