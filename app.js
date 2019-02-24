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
    seedDB  = require("./seeds")
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
    mongoose.connect("mongodb+srv://mijuoska:malkuth@cluster0-w2yyf.mongodb.net/yelp_camp?retryWrites=true", { useNewUrlParser: true})
    
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


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Yelp Camp is running!") 
   
  
    
});