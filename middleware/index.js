var Place = require('../models/places');
var Comment = require('../models/comments');
var Story = require('../models/story');
var User = require('../models/user');
var flash = require('connect-flash');
// all middleware
var middlewareObj = {};

middlewareObj.checkPlaceOwnership = function(req, res, next)
{
		if(req.isAuthenticated())
		{
			Place.findById(req.params.id, function(err, foundPlace)
			{
				if(err)
				{
					req.flash("error", "We can't find that place.");
					res.redirect("back");
				}
				else
				{	
					if(foundPlace.author.id.equals(req.user.id))
					{
							next();			
					}
					else
					{
						req.flash("error", "You don't have permission to do that.");
						res.redirect("back");
					}
				}
			});
		} else 
		{
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("back");
		}
}

middlewareObj.checkCommentOwnership = function(req, res, next)
{
		if(req.isAuthenticated())
		{
			Comment.findById(req.params.comment_id, function(err, foundPlace)
			{
				if(err)
				{
					req.flash("error", "We can't find that comment.");
					res.redirect("back");
				}
				else
				{	
					if(foundPlace.author.id.equals(req.user.id))
					{
							next();			
					}
					else
					{
						req.flash("error", "You don't have permission to do that.");
						res.redirect("back");
					}
				}
			});
		} else 
		{
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("back");
		}
}
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}
middlewareObj.isLoggedOut = function(req, res, next){
	if(req.isAuthenticated()){
			res.redirect("places");
	}
	else
	{
		return next(); 
	}


}
middlewareObj.votedStoryCheck = function(req, res)
{
		User.findById(req.params.id).populate('voted').exec(function(err, foundUser)
		{
		if(err){
			console.log(err);
			res.redirect("back");
		} 
		else
		{
			if(foundUser)
			{
				console.log("You've already voted on this story!");
			}
			else
			{
			Story.create(function(err, foundStory)
			{
				if(err){
					console.log(err);
					//add error notifc
					//res.redirect("/places/" + req.params.id);
				} else {
					//foundStory.author = req.user.username;
					//connect new comment to campground
					foundStory.save();
					foundUser.voted.push(foundStory);
					foundUser.save();
					console.log(comment);
					//redirect to show page of campground
					res.redirect("back");
					}
			});
			}
		}
	});
}

module.exports = middlewareObj;