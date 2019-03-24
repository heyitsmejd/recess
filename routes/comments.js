var express = require("express");
var router = express.Router();
var Place = require('../models/places');
var Comment = require('../models/comments');
var middleware = require("../middleware");
router.post("/places/:id/comments", middleware.isLoggedIn, function(req, res){
	//lookup id
	Place.findById(req.params.id, function(err, foundPlace){
		if(err){
			console.log(err);
			res.redirect("/places");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment)
			{
				if(err){
					console.log(err);
					res.send("error");
					//add error notifc
					//res.redirect("/places/" + req.params.id);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//connect new comment to campground
					comment.save();
					foundPlace.comments.push(comment);
					foundPlace.save();
					console.log(comment);
					//redirect to show page of campground
					res.redirect("/places/" + req.params.id);
					}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
//EDIT COMMENT ROUTE
router.get("/places/:id/comments/:comment_id/edit",  middleware.checkCommentOwnership, function(req, res)
	{
		Comment.findById(req.params.comment_id, function(err, foundPlace)
		{
			if(err){
				res.redirect("back");
			}
			else
			{
				res.render("comments/edit", {comment: foundPlace, place: req.params.id});
			}
		});
							
	});

//UPDATE CAMPGROUND ROUTE
router.put("/places/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundPlace)
	{
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			res.redirect("/places/" + req.params.id);
		}
	});

});
//DESTROY ROUTE
router.delete("/places/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, foundPlace)
	{
		if(err)
		{
			res.redirect("back");
		}
		else
		{
			res.redirect("/places/" + req.params.id);
		}
	});

});


module.exports = router;