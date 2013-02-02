
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

/*
var exec = require('child_process')
	.spawn('C:/Program Files (x86)/VideoLAN/VLC/vlc.exe', 
		['-I dummy', 'D:/test.mp4']);
*/

var vlc = require('node-vlc');
console.log(vlc)