// library controller
// ./app/controllers/library.js

var hbs = require('hbs'),
	fs = require('fs'),
	util = require('util'),
	libraryPath = 'D:/Music/',
	mongoose = require('mongoose'),
	ObjectId = require('mongoose').Types.ObjectId,
	async = require('async'),
	Artist = mongoose.model('Artist'),
	Release = mongoose.model('Release'),
	Song = mongoose.model('Song'),
	request = require('request'),
	cheerio = require('cheerio');

exports.index = function (req, res) {
	console.log(__dirname);
	res.render('../../public/views/_main.html');
}

exports.search = function (req, res) {
	var query = req.params.query,
		media = req.query.media;
	console.log('searching for ', query, media);

	if (media == 'Music') {
		var reg = new RegExp(query, "gi"),
			results = {};

		// async flow control
		async.series([
			function searchArtists(callback) {
				Artist.find({name: { $regex: reg}}, function(err, result){
					if (err) { console.log('err', err); callback("searchArtist error"); }
					callback(null, result)
				});
			},
			function searchReleases(callback) {
				Release.find({title: { $regex: reg}}, function(err, result){
					if (err) { console.log('err', err); callback("searchRelease error"); }
					//console.log('Release Lookup: ', result);
					callback(null, result)
				});
			},
			function searchSongs(callback) {
				//addRelease(obj);
				Song.find({title: { $regex: reg}}, function(err, result){
					if (err) { console.log('err', err); callback("searchRelease error"); }
					//console.log('Song Lookup: ', result);
					callback(null, result)
				});
			},
			function searchExFM(callback) {
				request("http://ex.fm/api/v3/song/search/"+query, function(err, response, body){
					var data = JSON.parse(body),
						songs = data["songs"],
						result = {};

					for (var key in songs) {
						var obj = songs[key];
						//check for soundcloud url - shambala does not support
						if (/(api.soundcloud.com)/gi.test(obj.url)) {
							console.log('url contains soundcloud, removed:', obj.url);
							continue;
						}
						result[key] = {
							artist: obj.artist,
							title: obj.title,
							tags: obj.tags,
							image: obj.image,
							url: obj.url,
							type: 'exfm'
						}
					}
					callback(null, result)
				});
			}
		], function(err, result){
			if (err) {
				console.log(err);
			} else {
				console.log(result.searchArtists);
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				});
				res.end(JSON.stringify(result, undefined, 2));
			}
		});
	} else {
		console.log('wrong type');
	}
}