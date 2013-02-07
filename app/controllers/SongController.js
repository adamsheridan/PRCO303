var mongoose = require('mongoose'),
	Model = mongoose.model('Song'),
	Artist = mongoose.model('Artist'),
	Release = mongoose.model('Release'),
	async = require('async');


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

// show
exports.show = function (req, res) {
	/*
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
	*/

	Model.find({_id: req.params.id}, function(err, docs){
		console.log(docs[0]);
		//res.send(docs[0])

		async.parallel({
			artistid: function(callback){
				Artist.find({ _id: docs[0].artistid }, function(err, result){
					callback(null, result[0]);
				});
			},
			releaseid: function(callback){
				Release.find({ _id: docs[0].releaseid }, function(err, result){
					callback(null, result[0]);
				});
			}
		}, function (err, results) {
			if (err) { console.log(err) } else {
				//console.log('async results:', results, docs[0]);
				var obj = {};
				obj._id = docs[0]._id;
				obj.artistid = docs[0].artistid;
				obj.artistname = results.artistid.name;
				obj.releaseid = docs[0].releaseid;
				obj.releasetitle = results.releaseid.title;
				obj.songtitle = docs[0].title;
				obj.location = docs[0].location;
				console.log('obj is: ', obj)
				res.send(JSON.stringify(obj));

			}
		});

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

// IndexByArtist
exports.indexByArtist = function (req, res) {
	Model.find({ artistid: req.params.artistid }, function(err, docs){
		if (err) { console.log(err) } else {
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			res.end(JSON.stringify(docs));
		}
	});
}

// IndexByArtist
exports.indexByRelease = function (req, res) {
	Model.find({ releaseid: req.params.releaseid }, function(err, docs){
		if (err) { console.log(err) } else {
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			res.end(JSON.stringify(docs));
		}
	});
}