var connection_url = 'mongodb://localhost:27017/';
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    connection_url = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

module.exports = {
	url : connection_url
};
