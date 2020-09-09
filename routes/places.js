var express 	 = require("express"), 
	router  	 = express.Router(),
	Place        = require("../models/place"),
	middleware   = require("../middleware"),
	NodeGeocoder = require("node-geocoder");
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX - show all places
router.get("/", function(req, res){
	Place.find({}, function(err, places){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("places/index.ejs", {places: places, page: 'places'});
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
	geocoder.geocode(req.body.location, function (err, data) {
    	if (err || !data.length) {
			console.log(err);
      		req.flash('error', err);
      		return res.redirect('back');
    	}
 		var lat = data[0].latitude;
    	var lng = data[0].longitude;
    	var location = data[0].formattedAddress;
    	var newPlace = {name: name, price: price, image: image, description: desc, author:author, 
						location: location, lat: lat, lng: lng};
		Place.create(newPlace, function(err, places){
			if(err){
				res.redirect("/sights");
			}
			else{
				res.redirect("/sights");
			}
		});
	});
});

//SHOW - show more info about the place
router.get("/:id", function(req, res){
	Place. findById(req.params.id).populate("comments").exec(function(err, foundPlace){
		if(err || !foundPlace){
			req.flash("error", "Place not found");
			res.redirect("/sights");
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
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
		  req.flash("error", "Invalid address");
		  return res.redirect("back");
		}
		req.body.place.lat = data[0].latitude;
		req.body.place.lng = data[0].longitude;
		req.body.place.location = data[0].formattedAddress;

		Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
			if(err){
				req.flash("error", err.message);
				res.redirect("/sights");
			} else {
				req.flash("success","Successfully Updated!");
				res.redirect("/sights/" + req.params.id);
			}
		});
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
