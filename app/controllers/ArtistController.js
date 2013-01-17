var mongoose = require('mongoose'),
	Artist = mongoose.model('Artist');

	

exports.new = function(req, res) {
	res.render('newArtist.html', {
		title: 'New Artist',
		artist: new Artist({})
	});
}

exports.create = function(req, res){
	var artist = new Artist(req.body)
	artist.name = req.name;

	console.log('outputting artist: ', artist);
	console.log('headers', req.headers['content-type']);
	console.log('req', req.name);


	/* artist.save(function(err){
		if (err) {
			console.log(err);
		} 
	}); */
}

// edit

// update

// destroy

// show

// index
exports.index = function (req, res) {
	//console.log('curDir:', Artist)

	//console.log('artist.index');

	var data;

	Artist.findAll(function(err, artists){
		data = artists

		return data
	});

	/* Artist.find({}).exec(function(err, artists){
		if (err) return res.send(err);
		Artist.count().exec(function(err, count){
			res.send('found artist');
		});
	}); */
}