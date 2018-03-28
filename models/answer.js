var mongoose = require("mongoose");

var answerSchema = mongoose.Schema({
    text: String,
    img:String,
    created:{type:Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
          created:{type:Date, default: Date.now}
    }
});

module.exports = mongoose.model("Answer", answerSchema);
