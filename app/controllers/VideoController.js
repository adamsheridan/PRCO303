var mongoose = require('mongoose'),
	Video = mongoose.model('Video'),
	async = require('async');


// index
exports.index = function (req, res) {
	Video.find({}, function(err, docs){
		res.send(docs);
	});
}

exports.new = function(req, res) {
	console.log('new song', req.body);
	/* res.render('videos/new', {
		locals: {
			title: 'New Video'
		}
	}); */
}

exports.create = function(req, res){
	video = new Video();
	song.artistid = req.body.song_artist;
	song.releaseid = req.body.song_releaseid;
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
