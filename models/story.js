var mongoose = require('mongoose');
var storySchema = new mongoose.Schema({
	message: String,
	created: { type: Date, default: Date.now },
	author:  
	{ 
		id:  { 
			 type: mongoose.Schema.Types.ObjectId,
			 ref: "User"
		},
		username: String,
	},
	title: String,
	voted:  
	{ 
		id:  { 
			 type: mongoose.Schema.Types.ObjectId,
			 ref: "User"
		}
	},
});

module.exports = mongoose.model("Story", storySchema);
