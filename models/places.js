var mongoose = require('mongoose');
var placeSchema = new mongoose.Schema({
	name: String,
	image: String,
	country: String,
	downvotes: {
		type: Number,
		default: 0,
		min: 0
	},
	upvotes: {
		type: Number,
		default: 1
	},
	comments: [
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}
	],
	author:  
	{ 
		id:  { 
			 type: mongoose.Schema.Types.ObjectId,
			 ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Place", placeSchema);
