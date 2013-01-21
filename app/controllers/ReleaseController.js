var mongoose = require('mongoose'),
	Release = mongoose.model('Release');

// index
exports.index = function (req, res) {

	Release.find({}, function(err, docs){
		res.send(docs);
	});
}

exports.new = function(req, res) {
	console.log('new release')
	res.render('releases/new', {
		locals: {
			title: 'New Release'
		}
	});
}

exports.create = function(req, res){
	release = new Release();
	release.title = req.body.release_name;

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
	Release.find({_id: req.params.id}, function(err, docs){
		console.log('deleting', docs);
	});
}
