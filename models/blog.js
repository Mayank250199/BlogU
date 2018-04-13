var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  cat: String,
  followers:String,
  author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     username: String,
     fullname: String,
     email: String,
     mobile: String,
     following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
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
            },
              created:{type:Date, default: Date.now},
              comment:[
                {
                text:String,
                author:  {
                        id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User"
                        },
                        username: String
                    }
              }
            ]
          }
   ]

});

var Blog = mongoose.model("Blog",blogSchema);
module.exports = mongoose.model("Blog", blogSchema);
