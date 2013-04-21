var Library = {
	
	init: function() {
		//Library.getArtists();
		Library.events();
		Library.search.init();
	},

	events: function() {
		console.log('events loaded');

		$(document).on("click", '.playable', function(e){
			e.preventDefault();
			var $this = $(this),
				songid = $this.attr('data-song-id'),
				href = $this.attr('href').replace('D:', '/media/');

			Audio.queue.add(songid, href);
		});

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

		$(document).on("click", '.playlist a', function(e){
			e.preventDefault();
			var id = $(this).attr('data-id');
			//console.log('clicked', id);
			Library.playlist.queue(id);
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
				target: '#main-section', 
				contentType: 'artistIndex',
				meta: {
					artistid: artistid
				}
			}, text, href);
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

		render: {
			moviesIndex: function(State){
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
			}
		},

		populateView: function(){
			$.ajax({
				url: '/movies/',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					//console.log('loop', data[0].title)

					//Library.populateArtists(data);

					for (var i = 0; i < data.length; i++) {
						console.log(data[i].title);
						$('#movies').append('<li class="movie" data-id="'+data[i]._id+'"><img class="thumb" src="'+data[i].poster+'" /><h3 class="rating">'+data[i].rating+'</h3><a href="" class="cta play">Play</a></li>');
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

	tvshows: {
		render: {
			tvshowsIndex: function(State){
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
	},

	music: {
		init: function() {
			Library.music.populateView();
			Library.getArtists();
		},

		fx: {
			fadeLoad: function() {
				//console.log('fadeLoad called');

				var $elm = $('#trending .song');
				console.log('elm', $elm);

				$elm.each(function(i){
					console.log('elm', $(this));
					$elm.animate('opacity', '1');
				});
			}
		},

		populateView: function() {
			$.ajax({
				url: '/views/music.html',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					$('#page').html(data);
					Utils.setMainSectionWidth();
					Library.music.getHomeScreenData();
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
		},

		render: {
			artistIndex: function(State){
				$.ajax({
					url: '/artists/'+State.data.meta.artistid+'/releases',
					type: 'GET',
					success: function (data, textStatus, jqXHR) {
						var t = State.data.target; // eg '#releases'
						$(t).html('');
						$('#songs').html('');

						if ($('#releases').length == 0) {
							$(t).append('<ul id="releases"></ul>')
						}
						
						for (var i = 0; i < data.length; i++) {
							$('#releases').append('<li><a href="/library/release/'+data[i]._id+'" data-release-id="'+data[i]._id+'">'+data[i].title+'</a></li>');
						}
					},
					error: function(jqXHR, textStatus, error) {
						console.log('AJAX Error: ', error, textStatus, jqXHR);
					}
				});
			},
			releaseIndex: function(State){
				$.ajax({
					url: '/releases/'+State.data.meta.releaseid+'/songs',
					type: 'GET',
					success: function (data, textStatus, jqXHR) {
						var t = State.data.target,
							$t = $(t);
						console.log('data returned', data, 'target', $t);
						if ($t.length == 0) {
							$('#main-section').append('<ul id="songs"></ul>');
						} else {
							$t.html('');
						}
	
						for (var i = 0; i < data.length; i++) {
							$(t).append('<li><a href="'+data[i].location+'" class="playable" data-song-id="'+data[i]._id+'">'+data[i].title+'</a></li>');
						}
					},
					error: function(jqXHR, textStatus, error) {
						console.log('AJAX Error: ', error, textStatus, jqXHR);
					}
				});
			}
		},

		getHomeScreenData: function(){

			var homeScreenData = {}

			function getArtists(){
				$.ajax({
					async: false,
					url: '/artists/',
					type: 'GET',
					success: function (data, textStatus, jqXHR) {
						var artists = {};
						for (var i = 0; i<data.length; i++){
							homeScreenData['artists'] = data;
							$('#recently-added ul').append('<li class="item" data-mbid='+data[i].musicbrainzId+'><img src="/images/bauuer.jpg" class="thumb" /><h3 class="artist-title">'+data[i].name+'</h3></li>');
						}
						//console.log('homeScreen', homeScreenData);
					},
					error: function(jqXHR, textStatus, error) {
						console.log('--------------- ERROR ---------------');
						console.log(error);
						console.log(textStatus);
						console.dir(jqXHR);
					}
				});
			}

			function getArtwork() {
				$('#recently-added ul .item').each(function(){
					var $this = $(this),
						mbid = $(this).data('mbid');

					$.ajax({
						async: true,
						url: '/artwork/'+mbid,
						type: 'GET',
						success: function (data, textStatus, jqXHR) {

							var obj = Utils.objLiteralConvert(data);	

							//console.log('obj still is: ', obj);

							if (obj.artistthumb) {
								$this.children('.thumb').attr('src', obj.artistthumb[0].url);
							}
							
						},
						error: function(jqXHR, textStatus, error) {
							console.log('--------------- ERROR ---------------');
							console.log(error);
							console.log(textStatus);
							console.dir(jqXHR);
						}
					});
				});
			}

			function featuredArtist() {
				$.ajax({
					async: true,
					url: '/artists/',
					type: 'GET',
					success: function (data, textStatus, jqXHR) {

						var rand = Math.floor((Math.random()*data.length)+1),
							artistMbid = data[rand].musicbrainzId,
							artistName = data[rand].name,
							$featuredArtist = $('#featured-artist');

						$.ajax({
							url: '/artwork/'+artistMbid,
							type: 'GET',
							success: function(data){
								var obj = Utils.objLiteralConvert(data);
								$featuredArtist.css({
									'background-image': 'url('+obj.artistbackground[0].url+')',
									'background-size':  $('#main-section').css('width'),
									'background-repeat': 'no-repeat',
									'background-position':'top left'
								});

								if (!obj.musiclogo) {
									$featuredArtist.find('#logo').remove();
									$featuredArtist.append('<h1 id="logo">'+artistName+'</h1>');
								} else {
									$featuredArtist.find('#logo').attr('src', obj.musiclogo[0].url);
								}
							},
							error: function(jqXHR, textStatus, error) {
								console.log('--------------- ERROR ---------------');
								console.log(error);
								console.log(textStatus);
								console.dir(jqXHR);
							}
						});
						
					},
					error: function(jqXHR, textStatus, error) {
						console.log('--------------- ERROR ---------------');
						console.log(error);
						console.log(textStatus);
						console.dir(jqXHR);
					}
				});
			}


			featuredArtist();
			getArtists();
			getArtwork();
		}


	},

	playlist: {
		init: function() {
			Library.playlist.populate();
		},

		populate: function(){
			$.ajax({
				url: '/playlists/',
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					//console.log('playlists: ', data);
					Utils.setMainSectionWidth();
					for (var i = 0; i < data.length; i++) {
						$('.sidebar #playlists').append('<li class="playlist bold"><a href="" data-id="'+data[i]._id+'">'+data[i].name+'</a></li>');
					}
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
		},

		render: {
			playlistsIndex: function(){
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
			}
		},

		save: function(obj) {
			console.log('saving:', obj);
			var playlist = {};
			playlist.name = obj.name;
			playlist.obj = [];

			for (var i = 0; i < obj.length; i++) {
				playlist.obj.push(obj[i]);
			}

			playlist.obj = JSON.stringify(playlist.obj);

			console.log('stringify: ', playlist.obj);

			$.ajax({
				url: '/playlists/',
				type: 'POST',
				data: playlist,
				success: function (data, textStatus, jqXHR) {
					console.log('POSTed: ', data);
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
		},

		queue: function(id) {
			console.log('queing', id);
			$.ajax({
				url: '/playlists/'+id,
				type: 'get',
				success: function (data, textStatus, jqXHR) {
					//console.log('queueing: ', JSON.parse(data[0].obj));
					Audio.queue.queue = JSON.parse(data[0].obj);
					console.log('current queue:', Audio.queue.queue);
					Audio.queue.events.updated();
					
					//
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

	search: {
		init: function() {
			Library.search.events();
		},

		events: function(){
			$('#search-form #submit').click(function(e){
				e.preventDefault();
				var query = $('#search-form #query').val(),
					type = $('#media-type').find(":selected").text(),
					History = window.History,
					url = '/search/'+query+'?media='+type;

				console.log('searching for ', query, type);
				$.ajax({
					type: 'GET',
					url: url,
					success: function(data){
						History.pushState({ 
							navigate: true, 
							source: '#search-form', 
							target: '#main-section',
							contentType: 'searchResults',
							meta: {
								"results": data
							}
						}, query, url);
					},
					error: function(jqXHR, textStatus, error) {
						console.log('--------------- ERROR ---------------');
						console.log(error);
						console.log(textStatus);
						console.dir(jqXHR);
					}
				});
			});
		},

		renderResults: function (data){
			var $mainSection = $('#main-section'),
				$results = $mainSection.find("#results");
			$mainSection.html("<ul id='results'></ul>");
			console.log('RENDERING RESULTS', data);

			for (var i = 0; i < data["library"].length; i++) {
				var name = data["library"][i].name,
					mbid = data["library"][i].musicbrainzId;
				$results.append("<li class='artist'><a href=''>ey yo</a></li>");
			}
		}
	}
}


$(function(){
	Library.init();
});