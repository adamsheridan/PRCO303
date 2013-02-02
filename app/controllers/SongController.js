var mongoose = require('mongoose'),
	Model = mongoose.model('Song');

// index
exports.index = function (req, res) {
	Model.find({}, function(err, docs){
		res.send(docs);
	});
}

exports.new = function(req, res) {
	console.log('new song')
	res.render('songs/new', {
		locals: {
			title: 'New Song'
		}
	});
}

exports.create = function(req, res){
	song = new Model();
	song.artist = req.body.song_artist;
	song.title = req.body.song_title;
	song.location = req.body.song_location;

	//console.log('artist will be:', artist);

	song.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('saved', song);
			res.render('songs/new', {
				locals: {
					title: 'New Song',
					message: 'Successfully created!'
				}
			});
		}
	});
}

// show
exports.show = function (req, res) {
	Model.find({_id: req.params.id}, function(err, docs){
		res.send(docs);
	});
}

// edit
exports.edit = function (req, res) {
	console.log('editing', req.params.id)
	Model.find({_id: req.params.id}, function(err, docs){
		console.log(docs)
		if (docs == null) {
			res.render('songs/edit', {
				locals: {
					message: 'Could not find Song'
				}
			});
		} else { 
			res.render('songs/edit', {
				song: {
					id: docs[0]._id,
					artist: docs[0].artist,
					title: docs[0].title,
					location: docs[0].location 
				}
			});
		}
	});
}

// update
exports.update = function (req, res) {
	console.log('update with: ', req.params.id, req.body.title);

	Model.update({ _id: req.params.id }, { title: req.body.title }, function(err, doc){
		if (err) { console.log(err) } else {
			res.render('releases/edit', {
				locals: {
					title: 'Editing Release',
					message: 'Edit Successful'
				}
			});
		}
	});
}

// destroy
exports.destroy = function (req, res) {
	Model.find({_id: req.params.id}, function(err, docs){
		console.log('deleting', docs);
	});
}
