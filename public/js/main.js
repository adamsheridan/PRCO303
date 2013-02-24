(function(){

	var app = {
		init: function() {
			console.log('APP INIT');
		}
	}

	app.init();

}).call(this);

$(document).ready(function(){

	var analyser;

	function setupCanvas() {
		
	}

	function setupWebAudio() {
		
	}

	function draw() {
		
	}

	setupCanvas();
	setupWebAudio();
	draw();

	$(document).on("click", '.playable', function(e){
		e.preventDefault();
		var $this = $(this),
			songid = $this.attr('data-song-id'),
			href = $this.attr('href').replace('D:', '/media/');

		Audio.queue.add(songid, href);
	
	});

	function addToQueue(songid, href) {
		//$('#html5player').attr('src', href);

	}

	var History = window.History;

	History.Adapter.bind(window,'statechange', function(){ 
	    var State = History.getState();
        History.log(State.data, State.title, State.url);

        //console.log('pushState stuff: ', State.data, State.title, State.url);

        handleURL(State);

        // logic to handle pushState Object

        /*

        switch(State.data.pageType) {
        	case 'music':
        		//console.log('music ting', State.url);
        		var url = State.url;
        		var id = url.substring(url.lastIndexOf('/') + 1);
        		console.log('id is', id);
        		
        	break;

        	case 'tv':
        		console.log('tv ting');
        	break;

        	case 'movie':
        		console.log('movie ting');
        	break;
        }

        */

    });

	function handleURL(State) {
		//console.log('pushObj: ', State.data);
		// replace with switch statement soon
		if (State.data.contentType == 'artistIndex') {
			$.ajax({
				url: '/artists/'+State.data.meta.artistid+'/releases',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					var t = State.data.target; // eg '#releases'
					$(t).html('');
					$('#songs').html('');
					for (var i = 0; i < data.length; i++) {
						$(t).html('<li><a href="/library/release/'+data[i]._id+'" data-release-id="'+data[i]._id+'">'+data[i].title+'</a></li>');
					}
				},
				error: function(jqXHR, textStatus, error) {
					console.log('AJAX Error: ', error, textStatus, jqXHR);
				}
			});
		} else if (State.data.contentType == 'releaseIndex') {
			console.log(State.data.target)
			$.ajax({
				url: '/releases/'+State.data.meta.releaseid+'/songs',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					var t = State.data.target; // eg '#releases'
					console.log('data returned', data);
					$(t).html('');
					for (var i = 0; i < data.length; i++) {
						$(t).append('<li><a href="'+data[i].location+'" class="playable" data-song-id="'+data[i]._id+'">'+data[i].title+'</a></li>');
					}
				},
				error: function(jqXHR, textStatus, error) {
					console.log('AJAX Error: ', error, textStatus, jqXHR);
				}
			});
		} else if (State.data.contentType == 'moviesIndex') {
			$.ajax({
				url: '/views/movies.html',
				type: 'GET',
				success: function(data){
					$('#page').html(data);
					Library.movies.init();
				},
				error: function(error){
					console.log('error: ', error);
				}
			});
		} else if (State.data.contentType == 'tvshowsIndex') {
			$.ajax({
				url: '/views/tvshows.html',
				type: 'GET',
				success: function(data){
					$('#page').html(data);
				},
				error: function(error){
					console.log('error: ', error);
				}
			});
		}
	}

	function setWidth() {
		var mainWidth = window.innerWidth - 300;
        $('#main-section').css('width', mainWidth);
        console.log('widthSet')
	}

	setWidth();

	/* console.log('histroy.length: ', history.length);

	checkURL();

	var lastURL;

	function checkURL(hash) {
		if (!hash) var hash = window.location.hash;
		console.log('hash=', hash);
		console.log('window.location.hash', window.location.hash);
		if (hash != lastURL) {
			lastURL = hash;
			loadPage(hash);
		}
	}

	function loadPage(url) {
		console.log('url:', url)
	}*/
	/* var socket = io.connect(window.location.protocol + '//' + window.location.host);

	socket.on('connect', function () {
	    console.log('connected');
	});

	socket.on('updateArtists', function(arr){
		//console.log(arr);
		var $artists = $('#artists');
		for (var i = 0; i < arr.length; i++) {
			var artist = arr[i].split('|');
			console.log(artist);
			if (arr.indexOf('.') != 0) {
				$artists.append('<li class="artist"><a href="#" data-artist-id="'+artist[0]+'" class="artist">'+artist[1]+'</a></li>');
			}
		}
		//document.write(arr);
	})

	socket.on('updateReleases', function(releases){
		var release_list = $('#releases');
		release_list.html('');

		for (var i = 0; i < releases.length; i++) {
			console.log('release: ', releases[i]);
			release_list.append('<li><a href="#" data-artist-id="'+releases[i].artistid+'" data-release-id="'+releases[i]._id+'">'+releases[i].title+'</a></li>');
		}
	});

	// event handlers
	$('#sendDir').click(function(){
		socket.emit('getmedia', $('#inputDir').val());
	});

	$('#refresh-library').click(function(e){
		e.preventDefault();
		console.log('refreshing...');
		socket.emit('refreshLibrary');
	});

	$('#populate-releases').click(function(e){
		e.preventDefault();
		socket.emit('populateReleases');
	});

	$('.artist').live('click', function(e){
		e.preventDefault();
		var id = $(this).attr('data-artist-id');
		console.log('emitting', id);
		socket.emit('getReleases', id);
	});

*/

});