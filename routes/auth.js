var express = require("express");
var router = express.Router();
var flash = require('connect-flash');

var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
//Auth routes
router.get("/register", function(req, res){
	res.render("register");

});

router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", "We couldn't register you with those details.");
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to places " + user.username + "!");
				res.redirect("/places");
		});
	});
});
router.get("/login",  middleware.isLoggedOut, function(req, res){ 
	res.render('login');
});
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/places",
		failureRedirect: "/login",
		failureFlash: true,
		successFlash: "Welcome to Places!"
	}), function(req, res){

});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have been logged out.");
	res.redirect("/login");
});


module.exports = router;