var app = {
	init: function() {
		console.log('APP INIT');
		Library.music.init();
		app.events();
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

	var History = window.History;

	History.Adapter.bind(window,'statechange', function(){ 
	    var State = History.getState();
        History.log(State.data, State.title, State.url);
        handleURL(State);
    });

	function handleURL(State) {
		//console.log('pushObj: ', State.data);
		// replace with switch statement soon
		if (State.data.contentType == 'artistIndex') {
			Library.music.render.artistIndex(State);
		} else if (State.data.contentType == 'releaseIndex') {
			Library.music.render.releaseIndex(State);
		} else if (State.data.contentType == 'libraryIndex') {
			Library.music.init();
		} else if (State.data.contentType == 'moviesIndex') {
			Library.movies.render.moviesIndex(State);
		} else if (State.data.contentType == 'tvshowsIndex') {
			Library.tvshows.render.tvshowsIndex(State);
		} else if (State.data.contentType == 'browseIndex') {
			Browse.render.browseIndex(State);
		} else if (State.data.contentType == 'playlistsIndex') {
			Library.playlist.render.playlistsIndex(State);
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

});