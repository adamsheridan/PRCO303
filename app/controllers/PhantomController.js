var phantom = require('phantom');

exports.go = function (params) {

	phantom.create(function(err,ph){
		if (err) console.log('create error', err);
		ph.createPage(function(err, page){
			if (err) console.log('createPage error', err);
			page.open('http://google.com', function(err, status){
				if (err) console.log('page error:', err);
				console.log('page status', status);
				/* page.evaluate(function(){

				}); */
			});
		});
	//res.send('<h2>phantom</h2>', res.params.href);
	});
}