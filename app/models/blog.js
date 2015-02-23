var mongoose = require('mongoose');

module.exports = mongoose.model('blogs', {
	title : String,
	body : [String],
	timestamp : Date
});
