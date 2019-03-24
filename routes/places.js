var express = require("express");
var router = express.Router();
var Place = require('../models/places');
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.get("/places", function(req, res){ 

	Place.find({}, function(err, allPlaces)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render('places',{places:allPlaces, currentUser: req.user});
		}
	})
	
});

router.post("/places", middleware.isLoggedIn, function(req, res)
{
	// get data from form
	var author = {
		id : req.user._id,
		username: req.user.username
	}
	var newPlaces = {name: req.body.name, author: author, image: req.body.image, country: req.body.country};
	Place.create(newPlaces, function(err, newPlace){

		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log(newPlaces);
			res.redirect("/places");
		}
	})
	// redirect to campgrounds url
	
});
router.get("/places/:id/upvote", middleware.isLoggedIn, function(req, res)
{

	Place.findByIdAndUpdate(req.params.id, {$inc: {upvotes:1}}, function(err, upvote){

		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/places/" + req.params.id);
		}
	})
	// redirect to campgrounds url
	
});
router.get("/places/:id/downvote", middleware.isLoggedIn, function(req, res)
{
	var one = 1;
	Place.findByIdAndUpdate(req.params.id, {$inc: { downvotes : -1 }}, function(err, upvote){

		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/places/" + req.params.id);
		}
	})
	// redirect to campgrounds url
	
});
router.get("/places/new", middleware.isLoggedIn, function(req, res){ 
	res.render('places/new');
});
// SHOW - shows more place about page
router.get("/places/:id", function(req, res){
	Place.findById(req.params.id).populate("comments").exec(function(err, foundPlace)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("show", {place: foundPlace});
		}
	});

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