var mongoose = require("mongoose"),
	Place = require("./models/place"),
	Comment = require("./models/comment");

var data =[
	{
	name: "Lake Kaindy",
	image:" https://www.journalofnomads.com/wp-content/uploads/2018/07/Lake-Kaindy-Kazakhstan-place-to-visit.jpg",
	description:" Beautiful Lake near the Almaty which originally has been a forest"
	},
	{
	name: "Charyn Canyon",
	image:" https://www.journalofnomads.com/wp-content/uploads/2017/10/Charyn-Canyon-Featured-photo.jpg",
	description:" Canyon with mesmerizing view in the Southwest of Kazakhstan"
	}
]

function seedDB(){
	Place.remove({}, function(err){
		if(err){
			console.log(err);
		} else{
			console.log("Removed the place.");
		}
	});	
}
	// 	data.forEach(function(seed){
	// 		Place.create(seed, function(err, newPlace){
	// 			if(err){
	// 				console.log(err);
	// 			}
	// 			else{
	// 				console.log("added the place.")
	// 				Comment.create({
	// 					text: "Beautiful piece of land", 
	// 					author: "Aristotle"
	// 					},  function(err, comment){
	// 					if(err){
	// 						console.log(err);
	// 					}
	// 					else{
	// 						newPlace.comments.push(comment);
	// 						newPlace.save();
	// 						console.log("comment created");
	// 					}
	// 				});
	// 			}
	// 		});
	// 	});	
	// });	
// }

module.exports = seedDB;


