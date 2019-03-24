var mongoose = require('mongoose');
var recentTripsSchema = new mongoose.Schema({
		location: String,
		rating: Number,
		image: String
});

module.exports = mongoose.model("RecentTrips", recentTripsSchema);
