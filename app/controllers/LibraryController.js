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
	console.log('library index controller', __dirname);

	var Artists = mongoose.model('Artist');

	/* Artists.findAll(function(err, artists){
		//console.log('artists', artists);
		data.artists = artists;
		console.log('data', data);
		res.render('library/index', data);
	}); */

	async.parallel({
		artistsAll: function (){
			Artists.find({});
		},
		artistsOne: function (callback){
			Artists.find({name: 'Adam'}, callback);
		}
	}, function(results){
		/* res.render('library/index', {
			locals: {
				title: 'async test'
			},
			artists: total.artistsAll,
			artistsOne: total.artistsOne
		}); */
		console.log('results: ', results);
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