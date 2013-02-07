var Audio = {

	init: function() {
		console.log('audio init');
		//Audio.elements();
		Audio.events();
	},
	
	elements: {
		$sidebarArtists: $('.sidebar #artists'),
		audioPlayer: document.getElementById('html5player'),
		$audioPlayer: $('#html5player'),
		$btnPlay: $('#controls .play'),
		$btnNext: $('#controls .forward'),
		$btnBack: $('#controls .back')
	},

	events: function () {
		//var audio = ;

		//console.log(audio);

		$('#controls li a').click(function(e){
			e.preventDefault();
			var $this = $(this);

			switch ($this.attr('class')) {
				case "play":
					Audio.elements.audioPlayer.play();
					$(this).removeClass('play').addClass('pause');
					break;

				case "pause":
					Audio.elements.audioPlayer.pause();
					$(this).removeClass('pause').addClass('play');
					break

				case "loading":
					break;
			}
			
		});

		Audio.elements.$btnNext.click(function(){
			Audio.queue.next();
		});

		Audio.elements.$btnBack.click(function(){
			Audio.queue.back();
		});

		Audio.elements.$audioPlayer.bind('timeupdate', function() {
			var audio = Audio.elements.audioPlayer;
			var t = Math.floor(audio.currentTime).toString();
	
			$('#player #time-current').html(Utils.formatSecondsAsTime(t));
		});
	},

	queue: {
		queue: [],
		history: [],
		position: 0,

		init: function(){ 
		},

		events: {
			updated: function(){
				if (Audio.queue.queue.length > 1) {
					console.log('not first entry to queue', Audio.queue.queue);
				} else {
					console.log('first entry to queue!');
					Audio.queue.start();
				}
			}
		},

		add: function (songid, href) {
			var obj = {};
			obj.songid = songid,
			obj.location = href;

			Audio.queue.queue.push(obj);
			Audio.queue.events.updated();
			console.log('added: ', obj);
		},

		remove: function (obj) {
			// write this
		},

		next: function () {
			if (Audio.player.status = 'playing') {

			}
		},

		back: function () {
		},

		start: function () {
			var song = Audio.queue.queue[0];
			Audio.player.play(song);
		}
	},

	player: {

		status: 'paused',

		play: function (obj) {
			Audio.elements.$audioPlayer.attr('src', obj.location);
			Audio.player.updateUI(obj.songid);
			Audio.elements.audioPlayer.play();
			Audio.player.status = 'playing';
			Audio.elements.$btnPlay.removeClass('play').addClass('pause');
		},

		updateUI: function (songid) {
			console.log('updateUI', songid);
			$.ajax({
				url: '/songs/'+songid,
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					var data = JSON.parse(data);
					//console.log('updating ui with: ', data);
					$('#info h2').html(data.artistname+' - '+data.songtitle);
					$('#info h4').html(data.releasetitle);
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

};

$(function(){
	Audio.init();
});