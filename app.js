var express              = require("express"),
	 app                  = express(),
    bodyparser           = require("body-parser"),
	 mongoose             = require("mongoose"),
	 flash                = require("connect-flash"),
	 Campground           = require("./models/campground"),
	 Comment              = require("./models/comment"),
	 User                 = require("./models/user"),
	 seedDB               = require("./seeds"),
	 passport             = require("passport"),
	 localStrategy        = require("passport-local"),
	 methodOverride       = require("method-override");


var commentRoutes        = require("./routes/comments"),
	 campgroundRoutes     = require("./routes/campgrounds"),
	 indexRoutes          = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelp_camp_6d', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//seedDB();

app.use(require("express-session")({
	secret: "This is me Mujahid",
	resave: false,
	saveUninitialized: false
}));

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, process.env.IP);