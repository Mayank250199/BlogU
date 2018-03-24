var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     username: String
  },
    created:{type:Date, default: Date.now},
  comments: [
      {
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
      }
   ]

});

var Blog = mongoose.model("Blog",blogSchema);
module.exports = mongoose.model("Blog", blogSchema);
