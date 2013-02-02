(function(){

	var app = {
		init: function() {
			console.log('APP INIT');
		}
	}

	app.init();

}).call(this);

$(document).ready(function(){

	var History = window.History;

	History.Adapter.bind(window,'statechange', function(){ 
	    var State = History.getState();
        History.log(State.data, State.title, State.url);

        switch(State.data.pageType) {
        	case 'music':
        		//console.log('music ting', State.url);
        		var url = State.url;
        		var id = url.substring(url.lastIndexOf('/') + 1);
        		console.log('id is', id);
	        		$.ajax({
						url: '/artists/'+id,
						type: 'GET',
						success: function (data, textStatus, jqXHR) {
							//console.log(data)
							console.log(data[0].name);
							$('#artist-name').text(data[0].name)
						},
						error: function(jqXHR, textStatus, error) {
							console.log('--------------- ERROR ---------------');
							console.log(error);
							console.log(textStatus);
							console.dir(jqXHR);
						}
					});
        	break;

        	case 'tv':
        		console.log('tv ting');
        	break;

        	case 'movie':
        		console.log('movie ting');
        	break;
        }

    });
    
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