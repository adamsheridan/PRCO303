var mongoose = require('mongoose'),
	utils = require('../../config/utils.js'),
	Artist = mongoose.model('Artist'),
	Song = mongoose.model('Song');

// index
exports.index = function (req, res) {

	Artist.find({}, function(err, docs){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(docs));
	});
}

exports.new = function(req, res) {
	res.render('artists/new', {
		locals: {
			title: 'New Artist'
		}
	});
}

exports.create = function(req, res){

	var artist = new Artist();
	artist.name = req.body.name;
	artist.musicbrainzId = req.body.musicbrainzId;

	artist.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('Inserted', artist);
			res.writeHead(200);
			res.end('Inserted');
		}
	});
}

// show
exports.show = function (req, res) {
	Artist.find({_id: req.params.id}, function(err, artists){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(artists));
	});
}

// edit
exports.edit = function (req, res) {
	Artist.find({_id: req.params.id}, function(err, artists){
		console.log(artists)
		if (artists == null) {
			res.render('artists/edit', {
				locals: {
					message: 'Could not find Artist'
				}
			});
		} else { 
			res.render('artists/edit', {
				artist: {
					id: artists[0]._id,
					name: artists[0].name 
				}
			});
		}
	});
}

// update
exports.update = function (req, res) {
	Artist.update({ _id: req.params.id }, { name: req.body.name }, function(err, doc){
		if (err) { console.log(err) } else {
			console.log('Updated', req.body.name);
			res.writeHead(200);
			res.end('Updated');
		}
	});
}

// destroy
exports.destroy = function (req, res) {
	Artist.findById(req.params.id, function(err, doc){
		doc.remove(function(err){
			if (err) {
				console.log(err);
			} else {
				console.log('removed: ', req.params.id);
				res.writeHead(200, 'OK', {
					"Content-Type": "text/html"
				});
				res.end('Deleted Successfully');
			}
		});
	});
}
