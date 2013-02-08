var fs = require('fs'),
    mm = require('musicmetadata');

var parser = new mm(fs.createReadStream('D:/Music/Burial & Four Tet/Moth/01 Moth.mp3'));

parser.on('metadata', function(result){
    console.log('mm result: ', result);
});
