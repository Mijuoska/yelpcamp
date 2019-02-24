var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport")
    
    
// root route
router.get("/", function(req, res){
     res.render("landing"); 
      
  });
  


// sign-up form
router.get("/register", function(req, res) {
   res.render("register") 
});

// handle sign-up logic
router.post("/register", function(req, res) {
    // gets the username and password from the request body 
    req.body.username
    req.body.password
    // creates new user and authenticates
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
       if (err) {
           req.flash("error", err.message);
            return res.render("register");
       } passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to YelpCamp " + user.username);
          res.redirect("/campgrounds");
       });
       
    });
    
    
});

// show login form

router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    
});

// LOGOUT ROUTE

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});


module.exports = router;