// ./config/routes.js

//var mongoose = require('mongoose');
module.exports = function (app, express) {
	var library = require('../app/controllers/library'),
		artists = require('../app/controllers/ArtistController');

	/* app.get('/', function(req, res){
		res.render('test', {
			locals: {
				title: 'HBS'
			}
		});
	}); */
	
	app.get('/', library.index);
	app.get('/artists/new', artists.new);
	app.post('/artists/create', artists.create);
	
}