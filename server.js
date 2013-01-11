var express = require('express'),
	events = require('events'),
    http = require('http'),
    fs = require('fs'),
    file = require('file'),
    app = express(),
    server = http.createServer(app),
    mongo = require('mongojs'),
    ObjectId = mongo.ObjectId;
    io = require('socket.io').listen(server),
    sanitize = require('validator').sanitize;
    //$ = require('jquery');

server.listen(8080);

var libraryPath = '/Users/adam/Music/iTunes/iTunes Media/Music/';

//dbconfig
var db_url = "adam:foobar@localhost/prco303",
	collections = ['artists', 'releases', 'songs'];

var db = mongo.connect(db_url, collections);

// routing
app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/mylibrary.html');
});

app.use('/images', express.static(__dirname + '/public/images'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));

function mkObj(key, val) {
	var obj = {};
	obj._id = ObjectId(val);
	return obj;
}

io.sockets.on('connection', function(socket){

	//print current DB

	var getArtists = function() {

		db.artists.find({}).sort({name:1}, function(err, result){
			if (err) { console.log('ERROR: ', err) } else {
				//console.log(result);
				var artists = [];

				for (var i = 0; i < result.length; i++) {
					//console.log(result[i].name);
					artists.push(result[i]._id +'|'+ result[i].name);
				}

				socket.emit('updateArtists', artists);

			}
		});

	}();

	socket.on('populateReleases', function(){

		console.log('populating releases');

		var getArtists = function () {
			var artists = fs.readdirSync(libraryPath);
			getReleases(artists);
		}();

		function getReleases(artists) {
			for ( var i = 0; i < artists.length; ) {
				if (artists[i].indexOf('.') == 0) { i++; } else {
					var releases = fs.readdirSync(libraryPath + artists[i] + '/');
					getArtistId(artists[i], releases);
					i++;
				}
			}
		}

		function getArtistId(artistname, releases) {
			var obj = {};
			obj.name = artistname;
			//obj.releases = releases;
			db.artists.find(obj, function(err, result){
				//console.log('looking for', obj, 'found artist in db: ', result);
				obj.artistid = result[0]._id;
				obj.releases = releases;
				//console.log(obj);
				//splitReleases(obj);
				handleReleases(obj);
			}); 
		}

		function handleReleases(obj) {
			var arr = obj.releases,
				release = {};
			//console.log(obj.artistid, arr);
			for (var i = 0; i<arr.length;) {
				if (arr[i].indexOf('.') == 0) { 
					console.log('removing .DS_Store');
					//console.log(arr[i]);
					arr.splice(arr[i]);
				} else {
					//console.log(arr);
					//console.log('no ds store', arr);
				}
				//console.log('array is', arr);
				release.title = arr[i];
				release.artistid = obj.artistid;
				getMeta(release);
				i++;
			}
		}

		function getMeta(obj) {

			/* $("<h1>test passes</h1>").appendTo("body");
    		console.log($("body").html()); */

    		obj.meta = {};
    		obj.meta.catno = '';
    		obj.meta.year = '';
    		obj.meta.country = '';
    		obj.meta.style = [];
			//console.log(obj);

			insertRelease(obj);

		}

		function insertRelease(obj) {
			db.releases.insert(obj, function(err, result){
				if (err) { console.log(err); } else {
					console.log('Created', result);
				}
			});
		}



		/* 
		fs.readdir(libraryPath, function(err, artists){

			for (i = 0; i < artists.length;) {

				if (artists[i].indexOf('.') == 0) { i++; } else {
					//artists.push(files[i]);

					var releasePath = libraryPath + artists[i] + '/';
					
					fs.readdir(releasePath, function(err, releases){

						for (var i = 0; i < releases.length; i++) {
							console.log('artist name', artists[i])
							console.log('release name:', releases[i]);
						}

					});

					i++;
				}
			}	

		}); */
	});

	socket.on('getReleases', function(artistid){

		var artist = {};
		artist.artistid = ObjectId(artistid);
		//console.log('getting releases for: ', artist);

		//console.log(artist);

		console.log('finding', artist);

		db.releases.find(artist, function(err, releases){
			console.log(releases);
			socket.emit('updateReleases', releases);
		});

		//db.releases.save(artist);

		//console.log(db.artists.find());

		/* db.releases.find({}, artist, function(err, result){
			if (err) { console.log(result) } else {
				console.log(result);
			}
		}); */

		/* db.releases.find(artist, function(err, result){
			if (err) { console.log('ERROR: ', err) } else {
				//console.log(result);
				var artists = [];

				for (var i = 0; i < result.length; i++) {
					//console.log(result[i].name);
					artists.push(result[i].id +'|'+ result[i].name);
				}

				socket.emit('updateArtists', artists);

			}
		}); */

		//socket.emit('printReleases', releases);

		/*

	});

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

  	/* socket.on('getmedia', function(dir){
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
	*/
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

		var artists_inserts = [],
			releases_inserts = [],
			songs_inserts = [];

		//update artists
		var getArtists = function() {

			var artists = [];

			fs.readdir(libraryPath, function(err, files){

				if (err) { console.log(err); }

				//get artists
				for ( i = 0; i < files.length; ) {

					if (files[i].indexOf('.') == 0) { i++; } else {

						var artistName = files[i],
							artist = {};
						artist.name = artistName;
						
						function checkArtistExists(objArtist) {
							db.artists.find(objArtist, function(err, result){
								if (err) { console.log(err) } else {
									if(result.length == 0) {
										console.log('Could not find: ', objArtist);
										artists_inserts.push(objArtist);
										console.log('Queued for insertion: ', objArtist);
									}
								}
							});
						}

						checkArtistExists(artist);

						i++;

					}

				} 

				//getReleases();

			});

		}();

		//find releases from folders
		function getReleases() {

			console.log('getReleases');

			for ( i = 0; i < artists_inserts.length; i++ ) {

				var path = libraryPath + artists[i];

				console.log('we wil be searching:', path);

				/* 
					fs.readdir(path, function(err, files){
						//console.log(step);
						//console.log(files);

						if (err) { console.log(err) } 

						for ( i = 0; i < files.length; i++ ) {

							console.log(artist+':'+files[i]);

							//+ ':' +files[i]
						}

					});
				*/

			}

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