var Audio = (function(){

	var init = function() {
		console.log('audio init');
		elements();
		events();
	};
	
	var elements = function () {
		var $sidebarArtists = $('.sidebar #artists');
	};

	var events = function () {
		var audio = document.getElementById('html5player');

		console.log(audio);

		$('#controls li a').click(function(e){
			e.preventDefault();
			var $this = $(this);

			switch ($this.attr('class')) {
				case "play":
					audio.play();
					$(this).removeClass('play').addClass('pause');
					break;

				case "pause":
					audio.pause();
					$(this).removeClass('pause').addClass('play');
					break

				case "loading":
					break;
			}
			
		});

		$(audio).bind('timeupdate', function() {
			var t = Math.floor(audio.currentTime).toString();
			console.log(t), audio.playbackRate, audio.seekable, audio.ended;
			$('#player #time-current').html(formatSecondsAsTime(t));
			
		})

		function formatSecondsAsTime(secs, format) {
		  var hr  = Math.floor(secs / 3600);
		  var min = Math.floor((secs - (hr * 3600))/60);
		  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

		  if (min < 10){ 
		    min = "0" + min; 
		  }
		  if (sec < 10){ 
		    sec  = "0" + sec;
		  }

		  return min + ':' + sec;
		}
	};

	init();

}());