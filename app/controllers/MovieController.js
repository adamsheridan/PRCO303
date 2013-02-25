var mongoose = require('mongoose'),
	Movie = mongoose.model('Movie'),
	async = require('async'),
	request = require('request');


// index
exports.index = function (req, res) {
	Movie.find({}, function(err, docs){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(JSON.stringify(docs));
	});
}

exports.new = function(req, res) {
	console.log('path:', req.route.path);

	res.render('movies/new', {
		locals: {
			title: 'New Movie'
		}
	});
}

exports.create = function(req, res){

	movie = new Movie();
	movie.title = req.body.title;
	movie.rating = req.body.rating;
	movie.thumb = req.body.thumb;
	movie.src = req.body.src;

	request('http://api.themoviedb.org/3/search/movie?api_key=d2033b71b41ec5c5e9be31423c0e8598&query='+movie.title, function (error, response, body){
		if (error) {
			console.log(response, error);
		} else {
			console.log(response, body);
		}
	});

	//console.log('artist will be:', artist);

	/* movie.save(function(err){
		if (err) {
			console.log(err);
		} else {
			console.log('saved', movie);
			res.render('movies/new', {
				locals: {
					title: 'New Movie',
					message: 'Successfully created!'
				}
			});
		}
	}); */
}

exports.play = function(req, res) {
	var id = req.params.id;
	Movie.find({_id: req.params.id}, function(err, docs){
		if (err) { console.log(err) } else {
			res.send('Playing ', docs[0].src);
			require('../../config/batch.js')(docs[0].src);
			console.log(__dirname);
		}
	});
	//

}
