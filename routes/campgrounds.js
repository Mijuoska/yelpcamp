var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware")
    slugify = require("slugify")

//var campgrounds = [ {name: "Salmon Creek", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f9c07ea3edb3bf_340.jpg"},
        //  {name: "Granite Hill", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f9c07ea3edb3bf_340.jpg"},
        //  {name: "Mountain Goat's Rest", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"},
        //  ];


 // INDEX - Show all campgrounds
  router.get("/", function(req, res) {
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err)
        } else {
        }   res.render("campgrounds/index", {campgrounds:allCampgrounds});
    })
  });

 // create route
  
router.post("/", middleware.isLoggedIn, function(req, res){
      // get data from form and add to campgrounds array
     var name = req.body.name
     var price = req.body.price
      var image = req.body.image
      var desc = req.body.description
      var author = {
          id: req.user._id,
          username: req.user.username
      }
      var newCampground = {name: name, price: price, image: image, description: desc, slug: slugify(name), author: author}
// Create a new campground and save to database
Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
        console.log(err)
    } else {
        // redirect to campgrounds page
      req.flash = ("success", "Successfully added new camgpround!")
      res.redirect("/campgrounds");
    }
    
});

      
  });
  
  
// add new campground route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
    
});

    
    // show more info about individual campgrounds
router.get("/:id", function(req, res){
   // find the campground with the provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err) {
           console.log(err)
       } else {
           console.log(foundCampground)
         // render show template with that campground
   res.render("campgrounds/show", {campground: foundCampground});    
           
       }
       
   });
    
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground})
            });    
         });

// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
        
    });

});

// DEstroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
        res.redirect("/campgrounds")
    } else {
        res.redirect("/campgrounds")
    }
});
    
});





module.exports = router;