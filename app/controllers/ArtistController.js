var mongoose = require('mongoose'),
	Artist = mongoose.model('Artist');

// index
exports.index = function (req, res) {

	Artist.find({}, function(err, artists){
		res.send(artists)
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
	//var artist = new Artist(req.body)
	//artist.name = req.name;
	console.log('headers', req.headers['content-type']);
	console.log('req', req.body.artist_name);

	artist = new Artist();
	artist.type = "artist";
	artist.name = req.body.artist_name;

	//console.log('artist will be:', artist);

	artist.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('saved', artist);
			res.render('artists/new', {
				locals: {
					title: 'New Artist',
					message: 'Successfully created!'
				}
			});
		}
	});
}

// show
exports.show = function (req, res) {
	Artist.find({_id: req.params.id}, function(err, artists){
		res.send(artists);
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
	console.log('update with: ', req.params.id, req.body.name);

	Artist.update({ _id: req.params.id }, { name: req.body.name }, function(err, doc){
		if (err) { console.log(err) } else {
			res.render('artists/edit', {
				locals: {
					title: 'Editing Artist',
					message: 'Edit Successful'
				}
			});
		}
	});
}
// destroy
exports.destroy = function (req, res) {
	Artist.find({_id: req.params.id}, function(err, artists){
		console.log('deleting', artists);
	});
}
