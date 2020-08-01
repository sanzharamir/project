var express       = require("express"),
	app           = express(),
 	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	Comment       = require("./models/comment"),
	Place         = require("./models/place"),
	User          = require("./models/user"),
	methodOverride= require("method-override"),
	seedDB        = require("./seeds"),
	flash         = require("connect-flash");

var commentRoutes = require("./routes/comments"),
	placeRoutes   = require("./routes/places"),
	indexRoutes   = require("./routes/index");

var url = process.env.DATABASEU || "mongodb://localhost:27017/database";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

app.use(require("express-session")({
	secret: "Secret is hidden here",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//ROUTES
app.use("/", indexRoutes);
app.use("/sights/:id/comments", commentRoutes);
app.use("/sights", placeRoutes);

//LISTEN
app.listen(process.env.PORT || 3000, function(){
	console.log("Server is working");
});