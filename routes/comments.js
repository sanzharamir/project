var express    = require("express"), 
	router     = express.Router({mergeParams: true}),
	Place      = require("../models/place"),
	Comment    = require("../models/comment"),
	middleware = require("../middleware"); 

//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	Place.findById(req.params.id, function(err, foundPlace){
		if(err || !foundPlace){
			req.flash("error", "Place not found");
			res.redirect("/sights");
		}
		else{
			res.render("comments/new.ejs", {place: foundPlace});
		}
	});
});

//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	Place.findById(req.params.id, function(err, place){
		if(err){
			res.redirect("/sights");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					res.redirect("/sights");
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					place.comments.push(comment);
					place.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/sights/" + place._id);
				}
			});	
		}
	});	
});

//COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Place.findById(req.params.id, function(err, foundPlace){
		if(err || !foundPlace){
			req.flash("error", "Place not found");
			res.redirect("/sights");
		}
		else{
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("/sights");
				}
				else{
					res.render("comments/edit.ejs", {place_id: req.params.id, comment: foundComment});
				}
			});
		}
	});
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("/sights");
		}
		else{
			res.redirect("/sights/" + req.params.id);
		}
	});
});

//COMMENT DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("/sights");
		}
		else{
			req.flash("success", "Comment deleted");
			res.redirect("/sights/" + req.params.id);
		}
	});
});

module.exports = router;
