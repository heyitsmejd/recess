var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require("body-parser"),
	Place = require('./models/places'),
	Comment = require('./models/comments'),
	Story = require('./models/story'),
	RecentTrips = require('./models/recenttrips'),
	Interests = require('./models/interests'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	timeAgo = require('node-time-ago'),
	methodOverride = require('method-override'),
	flash = require('connect-flash');
	// User = require('./models/user');
	var cors = require('cors')
	var commentRoutes = require("./routes/comments");
	var authRoutes = require("./routes/auth");
	var placeRoutes = require("./routes/places");
	var profileRoutes = require("./routes/profile");
app.use(flash());
app.use(cors())
mongoose.connect("mongodb://localhost/yelp");
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
//Passport Config
app.use(require("express-session")({
	secret: "JWg90wjg9w0jgw0jwg#$!41",
	resave: false,
	saveUninitialized: false
}));
app.locals.timeAgo = require('node-time-ago');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



//Regular routes
app.get("/", function(req, res){ 
	res.render('login');
});
app.get("/profile", function(req, res){ 
	res.render('profile');
});



app.use(commentRoutes);
app.use(placeRoutes);
app.use(authRoutes);
app.use(profileRoutes);


app.listen(8081);
console.log('Server started on port 3000');