var express =           require("express"),
    app =               express(),
    bodyParser =        require("body-parser"),
    mongoose =          require("mongoose"),
    passport =          require("passport"),
    flash    =          require("connect-flash"),
    LocalStrategy =     require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    User     =          require("./models/user"),
    Comment = require("./models/comment"),
    seedDB  = require("./seeds"),
    customenv = require('custom-env').env('staging')
    app.locals.moment = require('moment')
    port = process.env.PORT || 3000;


console.log(process.env.APP_ENV)

console.log(process.env.APP_NAME)

    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12"
     
     mongoose.connect(url, { useNewUrlParser: true})
    
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

//  PASSPORT CONFIG

app.use(require("express-session")({
    secret: "I love Pauline",
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
    
});



function isLoggedIn(req, res, next) {
     if(req.isAuthenticated()) {
        return next()
    } res.redirect("/login")
}

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);





app.listen(port, function(){
   console.log("Yelp Camp is running!") 
    
});