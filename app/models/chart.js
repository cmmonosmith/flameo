var mongoose = require('mongoose');

module.exports = mongoose.model('charts', {
	title : String,
    user : String,
    data : [{
        date : Date,
        total : Number,
        actual : Number
    }],
    timestamp : Date
});