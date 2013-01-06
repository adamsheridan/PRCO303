$(document).ready(function(){

	var socket = io.connect(window.location.protocol + '//' + window.location.host);

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
				$artists.append('<li><a href="#" data-artist-id="'+artist[0]+'" class="artist">'+artist[1]+'</a></li>');
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

});