var request = require('request'),
	cheerio = require('cheerio'),
	async = require('async'),
	sanitize = require('validator').sanitize;


exports.go = function (req, res) {
	
	var url = 'http://'+req.params.href;

	console.log('scraping ',url);

	request(url, function(err, res, body){
		$ = cheerio.load(body);
		var content = $('#content').html();
		print(body);
	});

	function print(content){
		//console.log(content);

		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});

		res.end(content);

	}

	//phantom.create(function(err,ph){
	//	console.log(ph);
		/* if (err) console.log('create error', err);
		ph.createPage(function(err, page){
			if (err) console.log('createPage error', err);
			page.open('http://google.com', function(err, status){
				if (err) console.log('page error:', err);
				console.log('page status', status);
				//page.evaluate(function(){

				//});
			});
		}); */
	//res.send('<h2>phantom</h2>', res.params.href);
	//});
}

exports.youtube = function (req, res) {
	var url = 'http://www.youtube.com/user/'+req.params.channel;
	console.log('scraping ', url);
	request(url, function(err, response, body){
		$ = cheerio.load(body);
		var channelFeed = $('#channel-feed');
		res.send(body);
	});
}

exports.rinsefm = function (req, res) {

	function trim1 (str) {
	    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}

	if (req.params.content = 'podcasts') {
		console.log('gotta get dat podkarstz');

		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});

		var podcasts = [];

		async.series([
			function(callback) {
				request('http://rinse.fm/podcasts/?page=1', function(error, response, body){
					$ = cheerio.load(body);
					var podcasts = $('#podcasts-listing');
					callback(null, podcasts);
				});
			},
			function(callback) {
				request('http://rinse.fm/podcasts/?page=2', function(error, response, body){
					$ = cheerio.load(body);
					var podcasts = $('#podcasts-listing');
					callback(null, podcasts);
				});
			}
		], function(err, result){
			var data;

			if (err) {
				console.log(err);
			} else { 
				for (var i = 0; i < result.length; i++){
					data+=result[i];
				}
				parse(data);
			}
		});

		function parse(data) {
			$ = cheerio.load(data);
			var $podcast = $('.podcasts .podcast-list-item'),
				podcasts = [];

			$podcast.each(function(i, e){
				var podcast = {};
				podcast.image = $(this)[0].attribs['data-img-src'];
				podcast.name = $(this).find('.headline').text().trim();
				podcast.date = $(this).attr('data-air_day');
				podcast.time = $(this).attr('data-airtime');
				podcast.url = $(this).find('.download a').attr('href');
				podcasts.push(podcast);
			})

			res.end(JSON.stringify(podcasts));
		}

		/*
			var podcast = {};
			podcast.image = $(this)[0].attribs['data-img-src'];
			podcast.name = $(this).find('.headline').text().trim();
			podcast.date = $(this).attr('data-air_day');
			podcast.time = $(this).attr('data-airtime');
			podcast.url = $(this).find('.download a').attr('href');
		*/

		/* for (var i = 0; i < 10; i++){

			request('http://rinse.fm/podcasts/?page='+i, function(error, response, body){
				//console.log('######################## PAGE: '+i);
				$ = cheerio.load(body);
				var $podcast = $('.podcasts .podcast-list-item');
					$podcast.each(function(k,v){
					var podcast = {};
					podcast.image = $(this)[0].attribs['data-img-src'];
					podcast.name = $(this).find('.headline').text().trim();
					podcast.date = $(this).attr('data-air_day');
					podcast.time = $(this).attr('data-airtime');
					podcast.url = $(this).find('.download a').attr('href');

					//console.log(podcast);
					podcasts.push(podcast);

					res.write(JSON.stringify(podcast));

				});

			});

		} */

		
		console.log(podcasts);

		/* 

		res.end(podcasts); */
	}
}