// ./config/routes.js

var mongoose = require('mongoose');

//var mongoose = require('mongoose');
module.exports = function (app, express) {
	var library = require('../app/controllers/LibraryController'),
		artists = require('../app/controllers/ArtistController'),
		releases = require('../app/controllers/ReleaseController'),
		songs = require('../app/controllers/SongController'),
		browse = require('../app/controllers/BrowseController'),
		movies = require('../app/controllers/MovieController'),
		phantom = require('../app/controllers/PhantomController'),
		playlists = require('../app/controllers/PlaylistController'),
		artwork = require('../app/controllers/ArtworkController');

	var Artist = mongoose.model('Artist');

	app.get('/', library.index);


	//// API ROUTING ////

	//artists
	app.get('/artists/', artists.index);
	app.post('/artists/', artists.create);
	app.get('/artists/:id', artists.show);
	app.put('/artists/:id', artists.update);
	app.delete('/artists/:id', artists.destroy);

	//releases
	app.get('/releases/', releases.index);
	app.post('/releases/', releases.create);
	app.get('/releases/:id', releases.show);
	app.put('/releases/:id', releases.update);
	app.delete('/releases/:id', releases.destroy);
	app.get('/artists/:artistid/releases', releases.indexByArtist);

	//songs
	app.get('/songs/', songs.index);
	app.post('/songs/', songs.create);
	app.get('/songs/:id', songs.show);
	app.put('/songs/:id', songs.update);
	app.delete('/songs/:id', songs.destroy);
	app.get('/artists/:artistid/songs', songs.indexByArtist);
	app.get('/releases/:releaseid/songs', songs.indexByRelease);

	//movies
	app.get('/movies/', movies.index);
	app.post('/movies/', movies.create);
	app.get('/movies/play/:id', movies.play);
	app.get('/movies/:id', movies.show);
	app.put('/movies/:id', movies.update);
	app.delete('/movies/:id', movies.destroy);

	//playlists
	app.get('/playlists/', playlists.index);
	app.post('/playlists/', playlists.create);
	app.get('/playlists/:id', playlists.show);

	//scraper
	app.get('/scrape/:href', phantom.go);
	app.get('/scrape/youtube/:channel', phantom.youtube);
	app.get('/scrape/rinsefm/:content', phantom.rinsefm);

	//artwork
	app.get('/artwork/:id', artwork.getArtistArtwork);
	app.get('/artwork/release/:artist', artwork.getReleaseArtwork);

	// APPLICATION ROUTING //
	app.get('/library/*', library.index);
	app.get('/browse/*', library.index);
	app.get('/playlists/*', library.index);
	app.get('/search/:query', library.search);

	//app.get('/#/artist/:artistid', library.artist)
	//app.get('/library/artist/:id/releases/', function(req, res){
	//	res.render('library/index');
	//});

	//app.get('/library/release/:id', function(req, res){
	//	res.render('library/index');
	//});


	//app.get('/library/artist/:artistid/releases/', function(req, res){
	//	res.render('library/index');
	//});

	//app.get('/library/scan', library.scan);
	//app.post('/library/scan', library.scanDir);
	
	/* app.get('/library/playlists', library.playlists);
	app.get('/library/genres', library.genres);
	app.get('/library/rescan', library.rescan);
	app.post('/library/rescan', library.rescannow); */

	//	Artist.find({ _id: id}, function(err, result){
	//		console.log('param result: ', result[0]);
	//		req.artist = result[0];
	//		req.artist.name = result[0].name
	//		next();
	//	});
	//});

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