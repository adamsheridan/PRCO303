var mongoose = require('mongoose'),
	Release = mongoose.model('Release');

// index
exports.index = function (req, res) {

	Release.find({}, function(err, docs){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(docs));
	});
}

exports.indexByArtist = function (req, res) {

	Release.find({ artistid: req.params.artistid }, function(err, docs){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(docs));
	});
}

exports.new = function(req, res) {
	console.log('new release');
	res.render('releases/new', {
		locals: {
			title: 'New Release'
		}
	});
}

exports.create = function(req, res){
	release = new Release();
	release.title = req.body.release_name;
	release.artistid = req.body.release_artistid;

	//console.log('artist will be:', artist);

	release.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('saved', release);
			res.render('releases/new', {
				locals: {
					title: 'New Release',
					message: 'Successfully created!'
				}
			});
		}
	});
}

// show
exports.show = function (req, res) {
	Release.find({_id: req.params.id}, function(err, docs){
		res.send(docs);
	});
}

// edit
exports.edit = function (req, res) {
	console.log('editing', req.params.id)
	Release.find({_id: req.params.id}, function(err, docs){
		console.log(docs)
		if (docs == null) {
			res.render('releases/edit', {
				locals: {
					message: 'Could not find Release'
				}
			});
		} else { 
			res.render('releases/edit', {
				release: {
					id: docs[0]._id,
					title: docs[0].title 
				}
			});
		}
	});
}

// update
exports.update = function (req, res) {
	console.log('update with: ', req.params.id, req.body.title);

	Release.update({ _id: req.params.id }, { title: req.body.title }, function(err, doc){
		if (err) { console.log(err) } else {
			console.log('Updated', req.body.name);
			res.writeHead(200);
			res.end('Updated');
		}
	});
}

exports.destroy = function (req, res) {
	Release.findById(req.params.id, function(err, doc){
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

exports.indexByArtist = function (req, res) {
	Release.find({ artistid: req.params.artistid }, function(err, docs){
		if (err) { console.log(err) } else {
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			});
			res.end(JSON.stringify(docs));
		}
	});
}