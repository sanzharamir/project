var express    = require("express"),
	router     = express.Router({mergeParams: true}),
	Place      = require("../models/place"),
	Review     = require("../models/review"),
	middleware = require("../middleware");

// Reviews Index
router.get("/", function (req, res) {
    Place.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, place) {
        if (err || !place) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index.ejs", {place: place});
    });
});

// Reviews New
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if a user already reviewed the place, only one review per user is allowed
    Place.findById(req.params.id, function (err, place) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new.ejs", {place: place});

    });
});

// Reviews Create
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    //lookup place using ID
    Place.findById(req.params.id).populate("reviews").exec(function (err, place) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated place to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.place = place;
            //save review
            review.save();
            place.reviews.push(review);
            // calculate the new average review for the place
            place.rating = calculateAverage(place.reviews);
            //save place
            place.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect("/sights/" + place._id);
        });
    });
});

// Reviews Edit
router.get("/:review_id/edit", middleware.checkReviewOwnership, function (req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit.ejs", {place_id: req.params.id, review: foundReview});
    });
});

// Reviews Update
router.put("/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Place.findById(req.params.id).populate("reviews").exec(function (err, place) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate place average
            place.rating = calculateAverage(place.reviews);
            //save changes
            place.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect("/sights/" + place._id);
        });
    });
});

// Reviews Delete
router.delete("/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Place.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, place) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate place average
            place.rating = calculateAverage(place.reviews);
            //save changes
            place.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/sights/" + req.params.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;