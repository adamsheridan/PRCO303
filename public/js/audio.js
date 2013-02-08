var Audio = {

	init: function() {
		console.log('audio init');
		//Audio.elements();
		Audio.events();
		Audio.queue.persist();

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

		Audio.elements.$btnPlay.click(function(){
			Audio.player.play();
		});

		Audio.elements.$btnNext.click(function(){
			Audio.queue.next();
		});

		Audio.elements.$btnBack.click(function(){
			Audio.queue.back();
		});

		Audio.queue.elements.$btnQueue.click(function(e){
			e.preventDefault();
			if (Audio.queue.displayed == false) {
				Audio.queue.fx.showQueue();
			} else {
				Audio.queue.fx.hideQueue();
			}	
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
		displayed: false,

		init: function(){ 
		},

		elements: {
			$queue: $('#queue'),
			$btnQueue: $('#queue-icon')
		},

		fx: {
			showQueue: function () {
				Audio.queue.elements.$queue.animate({ 'bottom': '80px'});
				Audio.queue.displayed = true;
			},

			hideQueue: function(){
				Audio.queue.elements.$queue.animate({ 'bottom': '0'});
				Audio.queue.displayed = false;
			}
		},

		events: {
			updated: function(){

				Utils.setLocalStorage("queue", JSON.stringify(Audio.queue.queue));

				Audio.queue.updateUI();
				
				if (Audio.queue.queue.length > 1) {
					console.log('not first entry to queue', Audio.queue.queue);
				} else {
					console.log('first entry to queue! starting audio..');
					Audio.queue.start();
				}
					
			}
		},

		persist: function () {
			Audio.queue.queue = JSON.parse(Utils.getLocalStorage("queue"));
			Audio.queue.updateUI();
		},

		updateUI: function(){
			Audio.queue.elements.$queue.html('');
			for (var i = 0; i < Audio.queue.queue.length; i++) {
				Audio.queue.elements.$queue.append('<li>'+Audio.queue.queue[i].artistname+' - '+Audio.queue.queue[i].songtitle+'</li>');
			}
		},

		add: function (songid, href) {
			var obj = {};
			obj.songid = songid,
			obj.location = href;
			obj.queuePosition = Audio.queue.queue.length;

			$.ajax({
				url: '/songs/'+songid,
				type: 'GET',
				success: function (data, textStatus, jqXHR) {
					var data = JSON.parse(data);
					obj.artistname = data.artistname;
					obj.songtitle = data.songtitle;
					obj.releasetitle = data.releasetitle;

					Audio.queue.queue.push(obj);
					Audio.queue.events.updated();
					console.log('added: ', obj);
				},
				error: function(jqXHR, textStatus, error) {
					console.log('--------------- ERROR ---------------');
					console.log(error);
					console.log(textStatus);
					console.dir(jqXHR);
				}
			});
		},

		remove: function (obj) {
			// write this
		},

		next: function () {
			console.log('next');
			if (Audio.player.status = 'playing') {
				Audio.player.stop();
				Audio.queue.position += 1;
				var pos = Audio.queue.position,
					song = Audio.queue.queue[pos];
				Audio.player.play(song);
			}
		},

		back: function () {
			console.log('back');
			if (Audio.player.status = 'playing') {
				Audio.player.stop();
				Audio.queue.position -= 1;
				Audio.player.play(Audio.queue.queue[Audio.queue.position]);
			}
		},

		start: function () {
			var song = Audio.queue.queue[0];
			Audio.player.play(song);
		}
	},

	player: {

		status: 'paused',

		play: function (obj) {

			if (obj === undefined) {

				console.log('play obj not set');
				var pos = Utils.getLocalStorage('queue-position'),
					obj = Audio.queue.queue[pos];

				Audio.queue.position = parseInt(pos);
				console.log('obj empty, playing:', obj);
			}

			//console.log('queue-position:', Audio.queue.position);
			console.log('playing: ' +obj.songtitle+' with queue-position: ', Audio.queue.position);
			Utils.setLocalStorage('queue-position', Audio.queue.position);

			Audio.elements.$audioPlayer.attr('src', obj.location);
			//Audio.eq.setupWebAudio();
			Audio.player.updateUI(obj.songid);
			Audio.elements.audioPlayer.play();
			Audio.player.status = 'playing';
			Audio.elements.$btnPlay.removeClass('play').addClass('pause');
			//Audio.eq.draw();
		},

		stop: function () {
			console.log('stopping');
			Audio.elements.audioPlayer.pause();
			Audio.elements.$audioPlayer.attr('src', '');
			Audio.player.status = 'paused';
			Audio.elements.$btnPlay.removeClass('pause').addClass('play');
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
	},

	eq: {
		
		analyser: '',

		init: function () {
			Audio.eq.setupCanvas();
		},

		setupCanvas: function () {
			$('#header').prepend('<canvas id="eq">Canvas not Supported</canvas>');
			console.log('audio canvas created');
		},

		setupWebAudio: function () {
			var audio = Audio.elements.audioPlayer,
				audioCtx = new webkitAudioContext();
			var analyser = audioCtx.createAnalyser();
			var source = audioCtx.createMediaElementSource(audio);

			source.connect(analyser);
			analyser.connect(audioCtx.destination);

			console.log(analyser);

			var freqByteData = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(freqByteData);
			console.log(freqByteData);
			
		},

		draw: function() {
			window.webkitRequestAnimationFrame(Audio.eq.draw);
			var freqByteData = new Uint8Array(Audio.eq.analyser.frequencyBinCount);
			Audio.eq.analyser.getByteFrequencyData(freqByteData);
			console.log(freqByteData);
		}
	}
};

$(function(){
	Audio.init();
	Audio.eq.setupCanvas();
});