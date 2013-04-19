var mongoose = require('mongoose'),
	TVShow = mongoose.model('TVShow'),
	async = require('async');

var request = require('request');

// index
exports.getArtistArtwork = function (req, res) {
	var mbid = req.params.id;
	var url = 'http://api.fanart.tv/webservice/artist/25ba3a857cc44a743cde9400fefc3e11/'+mbid+'/JSON/all/';
	request(url, function(err, response, body){
		res.writeHead(200, {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		});
		res.end(body);
	});
}
