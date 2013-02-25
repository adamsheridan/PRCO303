var Library = {
	
	init: function() {
		//Library.getArtists();
		Library.events();
	},

	events: function() {
		console.log('events loaded');

		$(document).on("click", '.movie .play', function(e){
			e.preventDefault();
			
			var id = $(this).parent('li').attr('data-id');
			console.log(id);

			$.ajax({
				url: '/movies/play/'+id,
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					console.log(data)
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
			
		});

		$('#switch-media').click(function(e){
			e.preventDefault();
			var tab = $(this).children('ul');
			if (tab.hasClass('closed')) {
				tab.removeClass('closed').addClass('open');
			} else {
				tab.removeClass('open').addClass('closed');
			}
		});

		$('#switch-media a').click(function(e){
			e.preventDefault();
			var href = $(this).attr('href'),
				text = $(this).text(),
				contentType = href.split('/')[2];

			if ($(this).parents('ul').hasClass('open')) {
				console.log();
				History.pushState({ 
					navigate: true, 
					source: 'switch-media', 
					target: '', 
					contentType: contentType+'Index',
				}, text, href); 
			}

		});

			// closed sidebar pushState event handler
		$(document).on("click", '.artist a', function(e){
			e.preventDefault();

			var href = $(this).attr('href'),
				artistid = $(this).attr('data-artist-id'),
				text = $(this).text();

			History.pushState({ 
				navigate: false, 
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
				navigate: false, 
				source: '#releases a', 
				target: '#songs', 
				contentType: 'releaseIndex',
				meta: {
					releaseid: releaseid
				}
			}, text, href);
			
		});
	},

	elements: {
		$sidebarArtists: $('.sidebar #artists')
	},

	getArtists: function (){
		$.ajax({
			url: '/artists/',
			type: 'GET',
			success: function (data, textStatus, jqXHR) {
				Library.populateArtists(data);
			},
			error: function(jqXHR, textStatus, error) {
				console.log('--------------- ERROR ---------------');
				console.log(error);
				console.log(textStatus);
				console.dir(jqXHR);
			}
		});
	},

	populateArtists: function (data) {
		//console.log('populate artists data: ', data);
		//console.log(Library.elements.$sidebarArtists);
		if (Library.elements.$sidebarArtists) {
			//console.log($sidebarArtists);
			for (var i = 0; i < data.length; i++) {
				//console.log(data[i])
				$('.sidebar #artists').append('<li class="artist"><a href="/library/artist/'+data[i]._id+'/releases/" data-artist-id="'+data[i]._id+'">'+data[i].name+'</a></li>');
			}
		}
	},

	test: function (obj) {
		alert('test called');
		console.log('test obj: ', obj);
	},

	movies: {
		init: function() {
			Library.movies.populateView();
		},

		populateView: function(){
			$.ajax({
				url: '/movies/',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					console.log('loop', data[0].title)

					//Library.populateArtists(data);

					for (var i = 0; i < data.length; i++) {
						console.log(data);
						var thumb = data[i].thumb,
							thumbx = thumb.replace("C:/xampp/htdocs/prco303/public", "")
						$('#movies').append('<li class="movie" data-id="'+data[i]._id+'"><img class="thumb" src="'+thumbx+'" /><h1 class="title">'+data[i].title+'</h1><h2 class="year">'+data[i].year+'</h2><h3 class="rating">'+data[i].rating+'</h3><a href="" class="cta play">Play</a></li>');
					}
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
		}
	},

	music: {
		init: function() {
			Library.music.populateView();
			Library.getArtists();
		},

		populateView: function() {
			$.ajax({
				url: '/views/music.html',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					$('#page').html(data);
					Utils.setMainSectionWidth();
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
		}
	}
}


$(function(){
	Library.init();
});
/*
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
				tab.removeClass('open').addClass('artist');
			}
			
		});

		// closed sidebar pushState event handler
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

	init();

}()); */