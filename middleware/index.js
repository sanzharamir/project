var Place   = require("../models/place"),
	Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Place.findById(req.params.id, function(err, foundPlace){
		if(err){
			req.flash("error", "Place not found");
			res.redirect("back");
		}
		else{
			if(foundPlace.author.id.equals(req.user.id)){
				next();
			}
			else{
				req.flash("error", "You don't have to permission to do that");
				res.redirect("back");
			}
		}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Comment not found");
			res.redirect("back");
		}
		else{
			if(foundComment.author.id.equals(req.user.id)){
				next();
			}
			else{
				req.flash("error", "You don't have to permission to do that");
				res.redirect("back");
			}
		}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;