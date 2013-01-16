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