// library controller
// ./app/controllers/library.js

var hbs = require('hbs'),
	fs = require('fs'),
	wrench = require('wrench'),
	util = require('util'),
	libraryPath = 'D:/Music/',
	ID3 = require('id3'),
	mongoose = require('mongoose'),
	async = require('async');

exports.index = function (req, res){

	var Artists = mongoose.model('Artist');

	async.parallel({
		artistsAll: function (callback){
			Artists.find({}, function(err, result){
				callback(null, result);
			});
		},
		artistsOne: function (callback){
			Artists.find({name: 'Adam'}, function(err, result){
				callback(null, result);
			});
		}
	}, function(err, results){
		res.render('library/index', {
			locals: {
				title: 'Library Index'
			},
			artists: results.artistsAll
		})
	});
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
	console.log('hello', val);
}