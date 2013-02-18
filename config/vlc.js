// vlc.js

var fs = require('fs'),
	exec = require('child_process').exec;
/*
	console.log('VLC.js');

	fs.writeFile('hello.txt', 'Hello World', function(err){
		if (err) { console.log('error: ', err) } else {
			console.log('done');
		}
	}); */

module.exports = function (file) {

	console.log('vlc.js', file);

	var cmd = '"C:/Program Files (x86)/VideoLAN/VLC/vlc.exe" --fullscreen '+file;

	fs.writeFile('./config/vlc.bat', cmd, function(err){
		if (err) { console.log('error: ', err) } else {
			console.log('done');
			exec('vlc.bat');
		}
	});


}