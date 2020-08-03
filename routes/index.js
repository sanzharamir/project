var express  = require("express"), 
	router   = express.Router(),
	passport = require("passport"),
	User     = require("../models/user");

//LANDING PAGE - root route 
router.get("/", function(req, res){
	res.render("landing.ejs");
});

//AUTHENTICATION ROUTES
//shows sign up form
router.get("/register", function(req, res){
	res.render("register.ejs", {page: "register"});
});

//handles sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}
		else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to NatureBeauty " + user.username);
				res.redirect("/sights");
			});	
		}
	});
});

//shows login form
router.get("/login", function(req, res){
	res.render("login.ejs", {page: "login"});
});

//handles login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/sights", 
	failureRedirect: "/login"
	}), function(req, res){	
});

//handles logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out")
	res.redirect("/sights");
});

module.exports = router;
