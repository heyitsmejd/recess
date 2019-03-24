var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	job: String,
	age: {
		type: Number,
		default: 18
	},
	email: String,
	image: {
		type: String,
		default: "https://miquon.org/wp-content/uploads/2016/02/GenericUser.png"
	},
	hideProfile: {
		type: String,
		default: "off"
	},
	allowComments:{
		type: String,
		default: "on"
	},
	hideTrips: {
		type: String,
		default: "off"
	},
	location: {
		type: String,
		default: "N/A"
	},
	totalTrips: {
		type: Number,
		default: 0
	},
	favoritePlace: {
		type: String,
		default: "N/A"
	},
	aboutMe: {
		type: String,
		default: "Wouldn't you like to know?"
	},
	stories: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Story"
	}],
	interests: [
	{	type: mongoose.Schema.Types.ObjectId,
		ref: "Interests"
	}],
	recentTrips: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "RecentTrips"
	}]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);