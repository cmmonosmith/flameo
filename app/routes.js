var Chart = require('./models/chart');
var User = require('./models/user');
var mongoose = require('mongoose');

module.exports = function(app) {

	app.get('/api/chart', isAuthenticated, function(req, res) {
		Chart.find({'user': req.session.username}).sort('-timestamp').limit(1).exec(function(err, chart) {
			if (err) {
                console.log(err);
				res.send(err);
            }
			res.json(chart); 
		});
	});

	app.get('/api/users', isAdmin, function(req, res) {
		User.find({}).sort('-timestamp').exec(function(err, users) {
			if (err) {
                console.log(err);
				res.send(err);
            }
			res.json(users); 
		});
	});

    app.post('/api/user', isAdmin, function(req, res) {
        User.findOne({'username': req.body.username}, function(err, user) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            if (user == null) {
                user = {
                    username: req.body.username,
                    password: req.body.password
                };
                User.create(user, function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });
            } else {
                user.password = req.body.password;
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });
            }
            res.send(200);
        });
    });

    app.post('/api/chart', isAuthenticated, function(req, res) {
        var data = [];
        var dates = req.body.dates.split('^');
        var totals = req.body.totals.split('^');
        var actuals = req.body.actuals.split('^');
        var i;
        for (i = 0; i < dates.length; i++) {
            data.push({date : dates[i], total : totals[i], actual : actuals[i]});
        }
        Chart.findOne({'user': req.session.username}, function(err, chart) {
            if (err) {
                console.log(err);
            }
            if (chart == null) {
                chart = {
                    user: req.session.username,
                    title: req.body.title,
                    data: data,
                    timestamp: new Date()
                };
                Chart.create(chart, function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });
            } else {
                chart.title = req.body.title;
                chart.data = data;
                chart.timestamp = new Date();
                chart.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                });
            }
            res.send(200);
        });
    });

    app.get('/private/pages/:page', isAuthenticated, function(req, res) {
		res.sendfile('./private/pages/' + req.params.page);
	});

    app.get('/private/admin/:page', isAdmin, function(req, res) {
		res.sendfile('./private/admin/' + req.params.page);
	});

    app.post('/login', function(req, res) {
        User.findOne({'username': req.body.username}, function(err, user) {
			if (err) {
                console.log(err);
				res.send(401);
            }
            if (user == null) {
                res.send(401);
            } else {
                if (user.password == req.body.password) {
                    req.session.authenticated = true;
                    req.session.username = req.body.username;
                    res.send(200);
                } else {
                    res.send(401);
                }
            }
		});
    });

    app.post('/logout', function(req, res) {
        req.session.authenticated = false;
        req.session.username = '';
        res.send(200);
    });
};

function isAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next();
    }
    res.sendfile('./public/pages/login.html');
}

function isAdmin(req, res, next) {
    if (req.session.authenticated && req.session.username === 'admin') {
        return next();
    }
    res.sendfile('./public/pages/login.html');
}