var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   location: String,
   hiking_trails: String,
   accommodation: String,
   slug: String,
   author: {
      id: { type: mongoose.Schema.Types.ObjectId,
            ref: "User"
      },
      username: String
      
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
         
      }
      ]
    
});

// COMPILING SCHEMA INTO A MODEL and exporting it

module.exports = mongoose.model("Campground", campgroundSchema);