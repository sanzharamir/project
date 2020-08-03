var express = require("express"), 
	router  = express.Router(),
	Place   = require("../models/place"),
	middleware = require("../middleware"); 

//INDEX - show all places
router.get("/", function(req, res){
	
	Place.find({}, function(err, places){
		if(err){
			console.log(err);
		}
		else{
			res.render("places/index.ejs", {places: places});
		}
	});
});

//NEW - form for creating new place
router.get("/new", middleware.isLoggedIn,  function(req, res){
	res.render("places/new.ejs");
});

//CREATE - add new place to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	var name =  req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author =  {
		id:	req.user._id,
		username: req.user.username
	};
	var newPlace = {name: name, price: price, image: image, description: desc, author: author};
	Place.create(newPlace, function(err, places){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/sights");
		}
	});
});

//SHOW - show more info about the place
router.get("/:id", function(req, res){
	Place. findById(req.params.id).populate("comments").exec(function(err, foundPlace){
		if(err || !foundPlace){
			req.flash("error", "Place not found");
			res.redirect("back");
		}
		else{
			res.render("places/show.ejs", {place: foundPlace});
		}
	});
});

//EDIT - show edit form to change infor about the place
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
	Place.findById(req.params.id, function(err, foundPlace){
		res.render("places/edit.ejs", {place: foundPlace});
	});
});

//UPDATE - updates the information through put request
router.put("/:id", middleware.checkPostOwnership, function(req, res){
	Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
		if(err){
				res.redirect("/sights");
		}
		else{
			res.redirect("/sights/" + req.params.id);
		}
	});
});

//DESTROY - remove place
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
	Place.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/sights");
		}
		else{
			res.redirect("/sights");
		}
	});
});

module.exports = router;
