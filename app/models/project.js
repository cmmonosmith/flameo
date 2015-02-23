var mongoose = require('mongoose');

module.exports = mongoose.model('projects', {
	title : String,
	imageUrl : String,
    imagetitle : String,
    sourceUrl : String,
    installerUrl : String,
    platform : [String],
    description : [String],
    team : String,
    roles : [{
        name : String,
        members : [String]
    }],
    timestamp : Date
});
