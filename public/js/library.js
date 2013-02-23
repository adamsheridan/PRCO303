var Library = (function(){

	var init = function (){
		elements();
		getArtists();
		events();
	};

	var hello = function () {
		alert('hello');
	};

	var events = function () {

		$('#switch-media').click(function(e){
			e.preventDefault();
			var tab = $(this).children('ul');
			if (tab.hasClass('closed')) {
				tab.removeClass('closed').addClass('open');
			} else {
				tab.removeClass('open').addClass('closed');
			}
			
		});

		// artist sidebar pushState event handler
		$(document).on("click", '.artist a', function(e){
			e.preventDefault();

			var href = $(this).attr('href'),
				artistid = $(this).attr('data-artist-id'),
				text = $(this).text();

			History.pushState({ 
				navigate: true, 
				source: 'artist-sidebar', 
				target: '#releases', 
				contentType: 'artistIndex',
				meta: {
					artistid: artistid
				}
			}, text, href);
			//document.title = "Fuck World";
		});

		$(document).on("click", '#releases a', function(e){
			e.preventDefault();

			var href = $(this).attr('href'),
				releaseid = $(this).attr('data-release-id'),
				text = $(this).text();

			History.pushState({ 
				navigate: true, 
				source: '#releases a', 
				target: '#songs', 
				contentType: 'releaseIndex',
				meta: {
					releaseid: releaseid
				}
			}, text, href);
			/* 
			//document.title = "Fuck World"; */
		});

	};

	var elements = function (){
		$sidebarArtists = $('.sidebar #artists');
	};

	var getArtists = function (){
		$.ajax({
			url: '/artists/',
			type: 'GET',
			success: function (data, textStatus, jqXHR) {
				//console.log(data)
				populateArtists(data);
			},
			error: function(jqXHR, textStatus, error) {
				console.log('--------------- ERROR ---------------');
				console.log(error);
				console.log(textStatus);
				console.dir(jqXHR);
			}
		});
	};

	var populateArtists = function (data) {
		if ($sidebarArtists) {
			//console.log($sidebarArtists);
			for (var i = 0; i < data.length; i++) {
				//console.log(data[i])
				$sidebarArtists.append('<li class="artist"><a href="/library/artist/'+data[i]._id+'/releases/" data-artist-id="'+data[i]._id+'">'+data[i].name+'</a></li>');
			}
		}
	};

	var test = function (obj) {
		alert('test called');
		console.log('test obj: ', obj);
	};

	//this.init();
	init();

}());