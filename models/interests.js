var mongoose = require('mongoose');
var interestsSchema = new mongoose.Schema({
		category: String,
		info: String
});

module.exports = mongoose.model("Interests", interestsSchema);
