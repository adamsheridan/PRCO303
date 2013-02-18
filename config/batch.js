
/* 
//console.log(__dirname)
var s = require('shelljs');

s.echo('Hello ShellJS');

s.exec('mkdir "D:/Hello" && dir');
//s.exec('dir "D:/"');

//s.exec('cd "C:/Program Files (x86)/VideoLAN/VLC/"');
s.exec('"C:/Program Files (x86)/VideoLAN/VLC/vlc.exe"', function(){
	console.log('callback');
});
//s.exec('" "D:/test.mp4"');
*/
module.exports = function (file) {

	var spawn = require('child_process').spawn,
		vlc = spawn('C:/Program Files (x86)/VideoLAN/VLC/vlc.exe', 
			[file]);

	//'-I dummy --fullscreen',

	vlc.on('exit', function(code){
		console.log('Exited with code ', code);
	});

}

/* var vlc = require('node-vlc');
console.log(vlc) */