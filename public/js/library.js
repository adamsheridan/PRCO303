(function(){

	var init = function (){
		elements();
		getArtists();
		events();
	};

	var events = function () {

		// artist sidebar pushState event handler
		$(document).on("click", '.artist a', function(e){
			e.preventDefault();

			var href = $(this).attr('href'),
				artistid = $(this).attr('data-artist-id'),
				text = $(this).text();

			History.pushState({ pageType: 'music' }, text, href);
			//document.title = "Fuck World";
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
				$sidebarArtists.append('<li class="artist"><a href="/library/artist/'+data[i]._id+'" data-artist-id="'+data[i]._id+'">'+data[i].name+'</a></li>');
			}
			ajaxNav();
		}
	};

	var ajaxNav = function () {
		//console.log('ajaxing');
	}

	//this.init();
	init();

}).call(this);