var mongoose = require('mongoose'),
	TVShow = mongoose.model('TVShow'),
	async = require('async');


// index
exports.index = function (req, res) {
	TVShow.find({}, function(err, docs){
		res.send(docs);
	});
}

exports.new = function(req, res) {
	console.log('path:', req.route.path);

	res.render('tvshows/new', {
		locals: {
			title: 'New Video'
		}
	});
}

exports.create = function(req, res){

	tvshow = new TVShow();
	tvshow.title = req.body.title;
	tvshow.tvshow = req.body.tvshow;
	tvshow.season = req.body.season;
	tvshow.episode = req.body.episode;
	tvshow.location = req.body.location;

	//console.log('artist will be:', artist);

	tvshow.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('saved', tvshow);
			res.render('tvshows/new', {
				locals: {
					title: 'New TVShow',
					message: 'Successfully created!'
				}
			});
		}
	});
}
