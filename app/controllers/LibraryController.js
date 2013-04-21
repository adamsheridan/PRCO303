// library controller
// ./app/controllers/library.js

var hbs = require('hbs'),
	fs = require('fs'),
	wrench = require('wrench'),
	util = require('util'),
	libraryPath = 'D:/Music/',
	ID3 = require('id3'),
	mongoose = require('mongoose'),
	ObjectId = require('mongoose').Types.ObjectId,
	async = require('async'),
	mm = require('musicmetadata'),
	Artist = mongoose.model('Artist'),
	Release = mongoose.model('Release'),
	step = require('Step'),
	request = require('request'),
	cheerio = require('cheerio');

exports.index = function (req, res) {

	console.log(__dirname);

	res.render('../../public/views/_main.html');

	/* res.render('library/index', {
		locals: {
			title: 'Index'
		}
	}); */
}

exports.scan = function (req, res) {
	res.render('library/scan');
}

exports.scanDir = function (req, res) {
	var dir = req.body.directory;
	var songs = [];

	console.log('scanning:', req.body.directory);

	wrench.readdirRecursive(dir, function(err, files){
		if (err) { console.log(err) } else {
			process(files);
		}
	});

	function process(arr) {
		//console.log('arr', arr);
		if (!arr) return false;
		for (var i = 0; i < arr.length; i++) {
			//console.log('loop', arr[i]);
			var n = arr[i].lastIndexOf('.'),
				split = arr[i].substring(n);
			if (split == '.mp3') {
				console.log('processing ', arr[i]);
				getID3(arr[i]);
			}
		}
		/* var format = arr[0].lastIndexOf('.');
		console.log('format', format); */
	}

	function getID3(url) {
		var path = dir + url;
		//path = "D:/Music/Addison Groove/Transistor Rhythm/01 Savage Henry.mp3";
		console.log('get ID3 of: ', path);
		var parser = new mm(fs.createReadStream(path));
		parser.on('metadata', function(result){
			//console.log(result);
			addToLibrary(result);
		});
	}

	function addToLibrary(obj) {
		//var artist = {};
		//artist.name = obj.artist[0];
		//console.log(obj);
		//console.log(artist);

		async.series([
			function(callback) {
				addArtist(obj);
			},
			function(callback) {
				//addRelease(obj);
				console.log('addRelease');
				callback(null);
			}
		], function(err, result){
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		});
		//addArtist(artist);
		//addRelease(obj);
	}

	function addArtist(obj) {
		Artist.find(obj, function(err, artists) {
			if (err) { console.log(err) } else if (artists.length < 1) {
				var artist = new Artist();
				artist.name = obj.artist[0];
				console.log('inserting artist: ', artist);
				artist.save(obj, function(err){
					if (err) { console.log(err); } else {
						console.log(obj, ' saved to database')
						callback(null, 'artist saved');
					}
				});
			} else {
				console.log(obj, ' already exists')
				callback('artist already exists');
			}
		});
	}

	function addRelease(obj) {

		//console.log(obj);
		//var artistid;
		//console.log('adding release', obj);

		/* stackoverflow: async.waterfall allows each function to pass its results 
		on to the next function, while async.series passes all results to the final 
		callback. At a higher level, async.waterfall would be for a data pipeline 
		("given 2, multiply it by 3, add 2, and divide by 17"), while async.series 
		would be for discrete tasks that must be performed in order, but are otherwise 
		separate. */

		console.log('attempt waterfall');

		async.waterfall([
				// getArtistId
				function getArtistId(callback) {
					Artist.find({ name: obj.albumartist[0] }, function(err, artist){
						if (err) { console.log(err) } else {
							//console.log('artist found');
							/* var release = {};
							release.artistid = artist[0]._id;
							release.artistname = artist[0].name;
							release.title = obj.album;
							release.year = obj.year; */
							//console.log('Adding', release);
							var artistid = artist[0]._id;
							//console.log('found artist: "',artist[0].name,'" with id: ', artistid);
							callback(null, artistid);
						}
					});
				},

				// checkExists
				function checkExists(artistid, callback) {
					//console.log('checkExists:', artistid);
					Release.find({ 'title': obj.album, 'artistid': artistid }, function (err, docs){
						if (err) { console.log(err) } else if (docs.length < 1) { 
							console.log('release not found');
							callback(null, artistid);
						} else {
							//console.log('found', docs[0]);
							callback('Release already exists');
						}
					});
				},

				function createRelease(artistid, callback){
					var release = new Release();
					release.artistid = artistid;
					release.title = obj.album;
					release.year = obj.year;

					release.save(release, function(err){
						if (err) { console.log(err) } else {
							console.log('inserted: ', release);
						}
					});
				}
			], 

			function(err, status) {
				console.log('error: ', err, status);
			}
		);

		
		//release.id3image = obj.picture;

		/* function checkExists(artistid) {
			console.log('artistid: ', artistid)
			Release.find({ artistid: artistid }, function(err, docs) {
				if (err) { console.log(err) } else {
					console.log('found doc', docs);
					//console.log(docs);
					/* release.save(release, function(err){
						if (err) { console.log(err) } else {
							console.log(release, ' saved to database')
						}
					}); */
		//		} 
	//		});
	//	}
		
	}

	/*var parser = new mm(fs.createReadStream('D:/Music/Burial & Four Tet/Moth/01 Moth.mp3'));

	parser.on('metadata', function(result){
	    console.log('mm result: ', result);
	});*/
}

exports.rescan = function (req, res) {
	console.log('rescan controller');

	data = {
		locals: {
			title: 'Library Rescan'
		}
	}

	res.render('library/rescan', data);
}

exports.rescannow = function (req, res) {
	var dirArtists = fs.readdirSync(libraryPath),
		artists = [],
		formats = ['ogg','mp3','wav'];

	/* artists.forEach(function(file){
		console.log(file)
		artists.push(file)
	});*/

	var path = 'D:/Music/VA/Sick Music 2/1-01 Memory Lane.mp3';

	var file = fs.readFileSync(path),
		id3_file = new ID3(file);
		console.log('id3:', file.getTags('title'));

	/* wrench.readdirRecursive(libraryPath, function(err, file){
		if (err) { return console.log(err) }

		//var matches = /^([^.]+).mp3$/.exec(file);
		//var filename = file.split('/').pop();

		console.log(file);

	}); */
}

exports.playlists = function (req, res) {
	var data = {
		locals: {
			title: 'Playlists'
		}
	}

	res.render('library/playlists', data);
}

exports.genres = function (req, res) {
	var data = {
		locals: {
			title: 'Genres'
		}
	}
	res.render('library/genres', data);
} 

exports.artist = function (req, res, val) {
	console.log('HELLO ARTIST');
	res.render('library/artist');
}

exports.search = function (req, res) {
	var query = req.params.query,
		media = req.query.media;
	console.log('searching for ', query, media);

	if (media == 'Music') {
		var reg = new RegExp(query, "gi"),
			results = {};
		Artist.find({name: { $regex: reg}}, function(err, result){

			results["library"] = result;

			request("http://ex.fm/api/v3/song/search/"+query, function(err, response, body){
				var data = JSON.parse(body);
				results["exfm"] = data["songs"];
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				res.end(JSON.stringify(results));
			});

		});
	} else {

	}

}