var request = require('request'),
	cheerio = require('cheerio');

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