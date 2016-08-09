var users = require('./users.json');

module.exports = {
	generateId: function(req, res, next) {
		req.body.id = users.length + 1;
		next();
	}
}