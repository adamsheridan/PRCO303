var Browse = {

	//exfm trending
	//subreddit
	//youtube rss
	
	init: function() {
		Browse.events();
	},

	events: function(){
		$('#sources .source .exfm-trending').click(function(e){
			e.preventDefault();
			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: '#sidebar', 
				target: '#main-section', 
				contentType: 'browseTrending',
			}, text, href);
			
		});

		$('#sources .source .youtube').click(function(e){
			e.preventDefault();
			console.log('youtube');
			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: '#sidebar', 
				target: '#main-section', 
				contentType: 'browseYoutube',
			}, text, href);
			
		});

		$('#sources .source .hypem').click(function(e){
			e.preventDefault();
			console.log('hypem');
			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: '#sidebar', 
				target: '#main-section', 
				contentType: 'browseHypem',
			}, text, href);
			
		});

		$('#sources .source .rinse').click(function(e){
			e.preventDefault();
			console.log('rinse');
			var href = $(this).attr('href'),
				text = $(this).text(),
				History = window.History;
				
			History.pushState({ 
				navigate: true, 
				source: '#sidebar', 
				target: '#main-section', 
				contentType: 'browseRinse',
			}, text, href);
			
		});
		
	},

	render: {
		browseIndex: function(State){
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
		}
	},

	sources: {
		exfm: {
			events: function() {
				$('#trending .song a').click(function(e){
					e.preventDefault();

					var $this = $(this);

					console.log('fuck');

					var obj = {}
					obj.location = $this.attr('href'),
					obj.api = 'exfm',
					obj.songid = $this.attr('data-songid'),
					obj.queuePosition = Audio.queue.queue.length,
					obj.artistname = $this.attr('data-artistname'),
					obj.songtitle = $this.attr('data-songtitle'),
					obj.releasetitle = $this.attr('data-releasetitle');
					obj.source = $this.attr('data-source');

					Audio.queue.queue.push(obj);
					Audio.queue.events.updated();
					//console.log('added to queue', Audio.queue.queue);
				});
			},

			trending: function(){
				$.ajax({
					url: 'http://ex.fm/api/v3/trending',
					type: 'GET',
					success: function(data){
						console.log('exfm trending ', data);
						var data = data.songs

						$('#main-section').append('<ul id="trending" class="clearfix"></ul>');

						$('#trending').html('');

						for (var i = 0; i < 20; i++) {
							console.log(data[i]);
							$('#trending').append('<li class="song"><a class="fadeLoad" href="'+data[i].url+'" data-artistname="'+data[i].artist+'" data-songtitle="'+data[i].title+'" data-releasetitle="'+data[i].album+'" data-source="'+data[i].sources[0]+'" style="background-image: url('+data[i].image.large+')"></a></li>');
						}

						Library.music.fx.fadeLoad();
						Browse.sources.exfm.events();
					},
					error: function(error){
						console.log('error: ', error);
					}
				});
			}
		},
		youtube: {
			loadChannel: function(State){
				//console.log(State);
				$.ajax({
					url: '/scrape/youtube/'+State.title,
					type: 'GET',
					success: function(data){
						$('#main-section').html(data);
						
					},
					error: function(error){
						console.log('error: ', error);
					}
				});
			}
			//
		},
		hypem: {
			ajax: function(State){
				$.ajax({
					url: 'http://hypem.com/playlist/popular/3day/json/1/data.js',
					type: 'GET',
					success: function(data){
						console.log('hypem trending', data);
						$('#page').html(data);
						
					},
					error: function(error){
						console.log('error: ', error);
						$('#page').html(data);
					}
				});
			}
		},
		rinse: {
			events: function() {
				$('#trending .song a').click(function(e){
					e.preventDefault();

					var $this = $(this);

					var obj = {}
					obj.location = $this.attr('href'),
					obj.api = 'rinsefm',
					//obj.songid = $this.attr('data-songid'),
					obj.queuePosition = Audio.queue.queue.length,
					obj.artistname = $this.attr('data-name'),
					obj.songtitle = $this.attr('data-date'),
					obj.releasetitle = 'http://rinse.fm';
					//obj.source = $this.attr('data-source');

					console.log('wut', obj);

					Audio.queue.queue.push(obj);
					Audio.queue.events.updated();
					//console.log('added to queue', Audio.queue.queue);
				});
			},
			ajax: function(Stat){
				$.ajax({
					url: '/scrape/rinsefm/podcasts',
					type: 'GET',
					success: function(data){
						console.log('hypem trending', data);
						$('#main-section').append('<ul id="trending" class="clearfix"></ul>');
						$('#trending').html('');
						for (var i = 0; i < data.length; i++) {
							//console.log(data[i]);
							$('#trending').append('<li class="song"><a class="fadeLoad" href="'+data[i].url+'" data-name="'+data[i].name+'" data-date="'+data[i].date+'" data-time="'+data[i].time+'" style="background-image: url('+data[i].image+')"></a></li>');
						}
						Browse.sources.rinse.events();
					},
					error: function(error){
						console.log('error: ', error);
					}
				});
			}
		}
	}
}

Browse.init();