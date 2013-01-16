var hbs = require('hbs');

exports.index = function (req, res) {
	data = {
		locals: {
			title: 'Browse'
		}
	}

	res.render('browse/index', data);
}