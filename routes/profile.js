var express = require("express");
var router = express.Router();
var Place = require('../models/places');
var User = require('../models/user');
var Story = require('../models/story');
var middleware = require("../middleware");

router.get("/user", middleware.isLoggedIn, function(req, res){ 
	res.redirect("/user/" + req.user.username);
});
router.get("/interests", function(req, res){ 
	res.redirect("interests");
});
router.get("/profile/update", middleware.isLoggedIn, function(req, res){ 
	User.findById(req.user.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect('back');
		}
		else{
			res.render('profile/update', {profile: foundUser});
		}

	});
});
router.patch("/profile/update/:id", middleware.isLoggedIn, function(req, res){
	var showProfile = "off",
		showComments = "off",
		showTrips = "off";
	if(req.body.profile.hideProfile == "on") { showProfile = "on"; }
	if(req.body.profile.allowComments == "on") { showComments = "on"; }
	if(req.body.profile.hideTrips == "on") { showTrips = "on"; }
	var data = {
		job : req.body.profile.job,
		hideProfile : showProfile,
		allowComments : showComments,
		hideTrips : showTrips,
		aboutMe : req.body.profile.job,
		favoritePlace : req.body.profile.job,
		image : req.body.profile.image
	}
	User.findByIdAndUpdate(req.params.id, data , function(err, foundUser)
	{
		if(err)
		{
			console.log(err);
			res.redirect("back");
		}
		else
		{
			console.log(req.body.profile.hideProfile);
			res.redirect("/places");
		}
	});
});

router.get("/user/:id", function(req, res){
	User.findOne( {'username' : {'$regex': [req.params.id], '$options': 'i'}}).populate("stories").exec(function(err, foundPlace)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log(foundPlace);
			//res.status(200).json({profile: foundPlace});
			res.render('profile', {profile: foundPlace});
		}
	});
});
router.get("/profile/:id", function(req, res){
	User.findOne( {'username' : {'$regex': [req.params.id], '$options': 'i'}}).populate({ path: 'users', populate: { path: 'stories interests' } }).exec(function(err, foundPlace)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("profile", {profile: foundPlace});
		}
	});
});
router.post("/test", function(req, res){
	console.log(req.body.message);
	res.json(req.body);
});

router.post("/story", function(req, res){
	//lookup id
	User.findById(req.user.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			//create new comment
			Story.create(req.body.story, function(err, story)
			{
				if(err){
					console.log(err);
					res.send("error");
					//add error notifc
					//res.redirect("/places/" + req.params.id);
				} else {
						story.author.id = foundUser.id;
						story.author.username = foundUser.username;
						//connect new comment to campground
						story.save();
						foundUser.stories.push(story);
						foundUser.save();
						console.log(story);
						//redirect to show page of campground
						res.redirect("back");
					}
			});
		}
	});
});
router.get("/story/:id/vote", middleware.isLoggedIn, middleware.votedStoryCheck, function(req, res)
{
	
});
router.post("/story", middleware.isLoggedIn, function(req, res)
{
		User.findById(req.params.id, function(err, foundUser){
		if(err){
			console.log(err);
			res.redirect("back");
		} 
		else
		{
		Story.create(req.body.story, function(err, foundStory)
			{
				if(err){
					console.log(err);
					//add error notifc
					//res.redirect("/places/" + req.params.id);
				} else {
					//foundStory.author = req.user.username;
					//connect new comment to campground
					foundStory.save();
					foundUser.story.push(foundStory);
					foundUser.save();
					console.log(comment);
					//redirect to show page of campground
					res.redirect("back");
					}
			});
		}
	})
	// redirect to campgrounds url
	
});

//EDIT PLACE ROUTE
router.get("/places/:id/edit", middleware.checkPlaceOwnership, function(req, res){
	Place.findById(req.params.id, function(err, foundPlace){
		res.render("edit", {place: foundPlace});				
	});
});
//UPDATE CAMPGROUND ROUTE
router.put("/places/:id", middleware.checkPlaceOwnership, function(req, res){
	Place.findByIdAndUpdate(req.params.id, req.body.places, function(err, foundPlace)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/places/" + req.params.id);
		}
	});

});
//DESTROY ROUTE
router.delete("/places/:id", middleware.checkPlaceOwnership, function(req, res){
	Place.findByIdAndRemove(req.params.id, function(err, foundPlace)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/places");
		}
	});

});



module.exports = router;