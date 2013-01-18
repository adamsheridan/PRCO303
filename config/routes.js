// ./config/routes.js

var mongoose = require('mongoose');

//var mongoose = require('mongoose');
module.exports = function (app, express) {
	var library = require('../app/controllers/LibraryController'),
		artists = require('../app/controllers/ArtistController')
		browse = require('../app/controllers/BrowseController');

	var Artist = mongoose.model('Artist');
	
	app.get('/', function(req, res){
		res.redirect('/library')
	});

	app.get('/mylibrary', function(req, res){
		res.redirect('/library')
	});

	app.get('/library', library.index);
	app.get('/library/playlists', library.playlists);
	app.get('/library/genres', library.genres);
	app.get('/library/rescan', library.rescan);
	app.post('/library/rescan', library.rescannow);
	app.get('/artists/new', artists.new);

	app.post('/artists/create', artists.create);

	app.get('/browse', browse.index);

	app.param('artistid', function(req, res, next, id){
		Artist.find({ _id: id}, function(err, result){
			console.log('param result: ', result[0]);
			req.artist = result[0];
			req.artist.name = result[0].name
			next();
		});
	});

	app.get('/library/artist/:artistid', function(req, res, next){
		console.log(req.artist);
		res.render('library/artist', {
			locals: {
				title: 'Library Artist'
			},
			artist: req.artist.name
		});
	});
	
}