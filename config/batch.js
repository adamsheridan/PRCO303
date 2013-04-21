
module.exports = function (file) {

	var spawn = require('child_process').spawn,
		vlc = spawn('C:/Program Files (x86)/VideoLAN/VLC/vlc.exe', 
			[file]);

	//'-I dummy --fullscreen',

	vlc.on('exit', function(code){
		console.log('Exited with code ', code);
	});

}

