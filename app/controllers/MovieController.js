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
	movie.src = req.body.src;

	request({
		method: 'GET',
		uri: 'http://api.themoviedb.org/3/search/movie?api_key=d2033b71b41ec5c5e9be31423c0e8598&query='+req.body.title,
		headers: {
			"Accept": "application/json"
		}
	}, function(err, response, body){
		if (err) console.log('error', err);

		var body = JSON.parse(body);
		
		console.log(body.results[0]);
		
		movie.title = body.results[0].title;
		movie.rating = body.results[0].vote_average;
		movie.release_date = body.results[0].release_date;
		movie.poster_path = body.results[0].poster_path;

		// grab config data for full image urls
		request({
			uri: 'http://api.themoviedb.org/3/configuration?api_key=d2033b71b41ec5c5e9be31423c0e8598',
			headers: {
				"Accept": "application/json"
			}
		}, function(err, response, body){
			if (err) console.log(err);
			var body = JSON.parse(body);
			movie.poster = body.images.base_url +'original'+ movie.poster_path;

			movie.save(function(err){
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
			});

		}); 

	});
}

exports.update = function(req, res){
	console.log('update with: ', req.params.id, req.body.title);

	var obj = {
		id: req.params.id,
		title: req.params.poster_path,
		poster: req.params.poster,
		rating: req.params.rating,
		release_date: req.params.release_date,
		src: req.params.src
	}

	Movie.update(obj, { title: req.body.title }, function(err, doc){
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
