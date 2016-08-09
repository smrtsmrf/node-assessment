var express = require('express');
var bodyParser = require('body-parser');
var users = require('./users.json');
var middleware = require('./middleware');
var port = 3000;

var app = express();
app.use(bodyParser.json());

app.listen(port, function() {
	console.log('server running on port', port);
});

// #1 and #2
// app.get('/api/users', function(req, res, next) {
// 	var result = req.query.language ? users.filter(function(user) {
// 		return user.language === req.query.language;
// 	}) : users;

// 	res.status(200).send(result)
// })

// #1 and #2 - get users w/ query enabled
app.get('/api/users', function(req, res, next) {
	switch (true) {
		case typeof(req.query.language) == 'string':
			var result = users.filter(function(user) {
				return user.language === req.query.language;
			})
			break;
		case typeof(req.query.age) == 'string':
			var result = users.filter(function(user) {
				return user.age == req.query.age;
			})
			break;
		case typeof(req.query.city) == 'string':
			var result = users.filter(function(user) {
				return user.city === req.query.city;
			})
			break;
		case typeof(req.query.state) == 'string':
			var result = users.filter(function(user) {
				return user.state === req.query.state;
			})
			break;
		case typeof(req.query.gender) == 'string':
			var result = users.filter(function(user) {
				return user.gender === req.query.gender;
			})
			break;
		default:
			var result = users
			break;
	}
	res.status(200).send(result)
})

// #3 and #9 - get users by id or privilege
app.get('/api/users/:param', function(req, res, next) {
	if (parseInt(req.params.param)) {
		var result = users.filter(function(user) {
			return user.id == req.params.param;
		})
	}
	else {
		var result = users.filter(function(user) {
			return user.type === req.params.param;
		})		
	}	
	result.length > 0 ? res.status(200).send(result) : res.status(404).send('User Not Found')
})

// #4 - add new user
app.post('/api/users', middleware.generateId, function(req, res, next) {
	req.body.type = 'user';
	users.push(req.body);
	res.status(200).send(req.body);
})

// #5 - add new admin (or moderator or user)
app.post('/api/users/:privilege', function(req, res, next) {
	req.body.type = req.params.privilege;
	users.push(req.body);
	res.status(200).send(req.body);
})

// #12 - update user 
app.put('/api/users/:userId', function(req, res, next) {
	var result = users.filter(function(user) {
		return user.id == req.params.userId
	})[0];
	for (key in req.body) {
		result[key] = req.body[key];
	}
	res.status(200).send(result);
})

// #10 - delete a user
app.delete('/api/users/:userId', function(req, res, next) {
	var result = users.filter(function(user) {
		return user.id !== parseInt(req.params.userId);
	});
	result.length < users.length ? (res.status(200).send(result), users = result) : res.status(404).send("User doesn't exist");
})

// #6 - update user's language
app.put('/api/users/language/:userId', function(req, res, next) {
	var result = users.filter(function(user) {
		return user.id == req.params.userId
	})[0];
	result.language = req.body.language;
	res.status(200).send(result);
})

// #7 - add to user's favorites
app.post('/api/users/forums/:userId', function(req, res, next) {
	var result = users.filter(function(user) {
		return user.id == req.params.userId
	})[0];
	result.favorites.push(req.body.add)
	res.status(200).send(result);
})

// #8 - delete from user's favorites
app.delete('/api/users/forums/:userId', function(req, res, next) {
	if (req.query.favorite) {
		var result = users.filter(function(user) {
		return user.id == req.params.userId
	})[0];
		var favorites = result.favorites;
		var query = req.query.favorite;
		var idx = favorites.indexOf(query);
		if (idx > -1) {
			favorites.splice(idx, 1);
			res.status(200).send(result);
		}
		else {
			res.send("favorite doesn't exist")
		}
	}
	else {
		res.send('missing paramater')
	}
})

module.exports = app;