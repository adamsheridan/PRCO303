// ./config/routes.js

var mongoose = require('mongoose');

//var mongoose = require('mongoose');
module.exports = function (app, express) {
	var library = require('../app/controllers/LibraryController'),
		artists = require('../app/controllers/ArtistController'),
		releases = require('../app/controllers/ReleaseController'),
		songs = require('../app/controllers/SongController'),
		browse = require('../app/controllers/BrowseController'),
		videos = require('../app/controllers/VideoController');

	var Artist = mongoose.model('Artist');

	app.get('/', library.index);


	//// API ROUTING ////
	//artists
	app.get('/artists/', artists.index);
	app.get('/artists/new', artists.new);
	app.post('/artists/', artists.create);
	app.get('/artists/:id', artists.show);
	app.get('/artists/:id/edit', artists.edit);
	app.put('/artists/:id', artists.update);
	app.delete('/artists/:id', artists.destroy);

	//releases
	app.get('/releases/', releases.index);
	app.get('/releases/new', releases.new);
	app.post('/releases/', releases.create);
	app.get('/releases/:id', releases.show);
	app.get('/releases/:id/edit', releases.edit);
	app.put('/releases/:id', releases.update);
	app.delete('/releases/:id', releases.destroy);
	app.get('/artists/:artistid/releases', releases.indexByArtist);

	//songs
	app.get('/songs/', songs.index);
	app.get('/songs/new', songs.new);
	app.post('/songs/', songs.create);
	app.get('/songs/:id', songs.show);
	app.get('/songs/:id/edit', songs.edit);
	app.put('/songs/:id', songs.update);
	app.delete('/songs/:id', songs.destroy);
	app.get('/artists/:artistid/songs', songs.indexByArtist);
	app.get('/releases/:releaseid/songs', songs.indexByRelease);

	//videos
	app.get('/tvshows/', videos.index);
	app.get('/tvshows/new', videos.new);

	// APPLICATION ROUTING //
	//app.get('/#/artist/:artistid', library.artist)
	app.get('/library/artist/:id/releases/', function(req, res){
		res.render('library/index');
	});

	app.get('/library/release/:id', function(req, res){
		res.render('library/index');
	});


	app.get('/library/artist/:artistid/releases/', function(req, res){
		res.render('library/index');
	});

	app.get('/library/scan', library.scan);
	app.post('/library/scan', library.scanDir);
	
	/* app.get('/library/playlists', library.playlists);
	app.get('/library/genres', library.genres);
	app.get('/library/rescan', library.rescan);
	app.post('/library/rescan', library.rescannow); */


	app.get('/browse', browse.index);

	app.param('artistid', function(req, res, next, id){
		Artist.find({ _id: id}, function(err, result){
			console.log('param result: ', result[0]);
			req.artist = result[0];
			req.artist.name = result[0].name
			next();
		});
	});

	/* app.get('/library/artist/:artistid', function(req, res, next){
		console.log(req.artist);
		res.render('library/artist', {
			layout: false,
			locals: {
				title: 'Library Artist'
			},
			artist: req.artist.name
		});
	}); */
	
}