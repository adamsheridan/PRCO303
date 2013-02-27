var mongoose = require('mongoose'),
	Playlist = mongoose.model('Playlist');

exports.index = function(req, res){
	Playlist.find({}, function(err, docs){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(docs));
	});
}

exports.create = function(req, res){
	//console.log('creating playlist', req.body);
	playlist = new Playlist();
	playlist.name = req.body.name,
	playlist.obj = req.body.obj;

	//console.log(playlist);


	playlist.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('saved', playlist);
		}
	});

}

exports.show = function (req, res) {
	Playlist.find({_id: req.params.id}, function(err, docs){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(docs));
	});
}