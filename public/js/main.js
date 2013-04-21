var app = {
	init: function() {
		console.log('APP INIT');
		console.log(Library);
		Library.music.init();
		app.events();
	},

	// terrible place to keep these but it will do for now
	keys: {
		tmdb: 'd2033b71b41ec5c5e9be31423c0e8598',
		fanarttv: '14b4149f558ec78c02c29833e77c0701'
	},

	events: function(){

		function highlight(element){
			console.log('highlighting ', element);
			$('#main-nav .current').removeClass('current');
			var $self = element,
				current = $self.hasClass('current');

			if (!current) {
				$self.addClass('current');
			} else {
				console.log('has current', $self);
			}

		}

		$('#main-nav #browse').click(function(e){
			e.preventDefault();
			console.log('browse click');

			highlight($(this));

			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: 'main-nav', 
				target: '#page', 
				contentType: 'browseIndex',
			}, text, href);
		});

		$('#main-nav #library').click(function(e){
			e.preventDefault();
			console.log('library click');
			highlight($(this));
			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: 'main-nav', 
				target: '#page', 
				contentType: 'libraryIndex',
			}, text, href);
		});

		$('#main-nav #playlists').click(function(e){
			e.preventDefault();
			console.log('playlists click');
			highlight($(this));
			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: 'main-nav', 
				target: '#page', 
				contentType: 'playlistsIndex',
			}, text, href);
		});

		$('#notifications').click(function(e){
			e.preventDefault();
			Utils.notifications.requestPermission();
		});

	},

	elements: {
		//menu
		$menuBrowse: $('#main-nav #browse'),
		$menuLibrary: $('#main-nav #library'),
		$menuGenres: $('#main-nav #genres'),
		$menuPlaylists: $('#main-nav #playlists')
	}
}

app.init();


$(document).ready(function(){

	var n = navigator;
        socket = io.connect('http://localhost/');

    socket.on('connect', function () {
        console.log('connected');
    });

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

		} else if (State.data.contentType == 'libraryIndex') {
			//console.log(State.data.target)
			Library.music.init();

		} else if (State.data.contentType == 'moviesIndex') {
			$.ajax({
				url: '/views/movies.html',
				type: 'GET',
				success: function(data){
					$('#page').html(data);
					Library.movies.init();
					Audio.queue.fx.hideQueue();
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
		} else if (State.data.contentType == 'browseIndex') {
			$.ajax({
				url: '/views/browse.html',
				type: 'GET',
				success: function(data){
					$('#page').html(data);
					Browse.init();
					Browse.sources.exfm.trending();
					Utils.setMainSectionWidth();
				},
				error: function(error){
					console.log('error: ', error);
				}
			});

		} else if (State.data.contentType == 'playlistsIndex') {
			$.ajax({
				url: '/views/playlists.html',
				type: 'GET',
				success: function(data){
					$('#page').html(data);
					Library.playlist.init();
					Utils.setMainSectionWidth();
				},
				error: function(error){
					console.log('error: ', error);
				}
			});
		} else if (State.data.contentType == 'browseTrending') {
			Browse.sources.exfm.trending();
			Utils.setMainSectionWidth();
		} else if (State.data.contentType == 'browseReddit') {
			Browse.sources.reddit();
			Utils.setMainSectionWidth();
		} else if (State.data.contentType == 'browseYoutube') {
			Browse.sources.youtube.loadChannel(State);
			Utils.setMainSectionWidth();
		} else if (State.data.contentType == 'browseHypem') {
			Browse.sources.hypem.ajax(State);
			Utils.setMainSectionWidth();
		} else if (State.data.contentType == 'browseRinse') {
			Browse.sources.rinse.ajax(State);
			Utils.setMainSectionWidth();
		} else if (State.data.contentType == 'searchResults') {
			Library.search.renderResults(State.data.meta.results);
		} 

		
	}

	Utils.setMainSectionWidth();

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