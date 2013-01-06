var express = require('express'),
	events = require('events'),
    http = require('http'),
    fs = require('fs'),
    file = require('file'),
    app = express(),
    server = http.createServer(app),
    mongo = require('mongojs'),
    io = require('socket.io').listen(server),
    sanitize = require('validator').sanitize;

server.listen(8080);

var libraryPath = '/Users/adam/Music/iTunes/iTunes Media/Music/';

//dbconfig
var db_url = "adam:foobar@localhost/prco303",
	collections = ['artists'];

var db = mongo.connect(db_url, collections);

// routing
app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.use('/images', express.static(__dirname + '/public/images'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

io.sockets.on('connection', function(socket){

	//print current DB
	console.log('CURRENT ARTISTS COLLECTION #####################');
	db.artists.find({}, function(err, result){
		if (err) { console.log('ERROR: ', err) } else {
			//console.log(result);
			var artists = [];

			for (var i = 0; i < result.length; i++) {
				//console.log(result[i].name);
				artists.push(result[i].id +'|'+ result[i].name);
			}

			socket.emit('updateArtists', artists);

		}
	});

	var listArtists = function () {
		//db.artists.find();
	}();

  console.log('new connection joined');
  //var dir = '/Applications/MAMP/htdocs/PRCO303-old/media/';

  /* db.connect(db_url, collections, function(){
  	console.log('Connected to MongoDB', db);
  }); */

   	/*
	collection = db.collection('users');

	collection.find(function(err, docs){
		console.log("collection find", err, docs);
	}); */

  	socket.on('getmedia', function(dir){
	  	fs.readdir(dir, function(err, files){
			if (err) {
				console.log('error', err);
			} else {
				console.log('sup');

				var arr = [];

				for( i = 0; i < files.length; ) {
					if (files[i] == ".DS_Store" || files[i] == ".iTunes Preferences.plist") { i++ }
					var name = files[i],
						key = 'artist_'+i;
					//name = sanitize(name).xss();
					//console.log(key+' : '+name);

					var obj = {};
					obj.id = i;
					obj.name = name;
					//console.log(obj);
					db.artists.save(obj);
					arr.push(name);
					i++;
				}

				socket.emit('updateArtists', arr);

			}	
	    });

    /*file.walk(dir, function(a, b, dirs, files){
    	console.log(a, b, dirs, files);
		var arr = [];
		for(i = 0; i < files.length; i++) {
			var name = files[i];
			arr.push(name);
			//res.write(name);
		}
		socket.emit('updateArtists', arr);
    });*/
  	});

  	socket.on('refreshLibrary', function(){

		console.log('Refreshing: ', libraryPath);

		//artist scoop
		var getArtists = function() {

			var artists = [];

			fs.readdir(libraryPath, function(err, files){

				if (err) { console.log(err); }

				//get artists
				for ( i = 0; i < files.length; ) {

					if (files[i].indexOf('.') == 0) { i++; } else {

						var artist = {};
						artist.name = files[i];

						//console.log(artist);

						//artists.push(artist.name);

						function checkExists(objArtist) {
							db.artists.find(objArtist, function(err, result){
								if (err) { console.log(err) } else {
									if(result.length == 0) {
										console.log('Could not find: ', objArtist);
										// add to db here
									}
								}
							});
						}

						i++;

					}

				}

				//getReleases(artists);

			});

		}();

		//find releases from folders
		function getReleases(artists) {

			//console.log(artists);

			for ( i = 0; i < artists.length; i++ ) {

				var artist = artists[i],
					path = libraryPath + artist;

				function go(artist){

					fs.readdir(path, function(err, files){
						//console.log(step);
						//console.log(files);

						if (err) { console.log(err) } 

						for ( i = 0; i < files.length; i++ ) {

							console.log(artist+':'+files[i]);

							//+ ':' +files[i]
						}

					});

				}

				go(artist);

			}

			getSongs(artists, release);

		}

	});
});

/* function readDir(res) {
	//console.log(res);

	var dir = '/Applications/MAMP/htdocs/PRCO303-old/media/';
	file.walk(dir, function(a,b, dirs, files){
		//console.log(dirPath);
		//console.log(dirs);
		//console.log(files);
	});

	fs.readdir(dir, function(err, files){
		if (err) {
			return console.log('error', err);
		} else {
			for(i = 0; i < files.length; i++) {
				var name = files[i];
				console.log(name);
				//res.write(name);
			}
		}
			
    });
}

readDir(); */