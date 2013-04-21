var Utils = {

	init: function () {
		// Array Remove - By John Resig (MIT Licensed)
		Array.prototype.remove = function(from, to) {
		  var rest = this.slice((to || from) + 1 || this.length);
		  this.length = from < 0 ? this.length + from : from;
		  return this.push.apply(this, rest);
		};
	},

	setLocalStorage: function (key, val) {
		if (Modernizr.localstorage) {
			localStorage.setItem(key, val);
		} else {
			console.log('Local Storage not supported!');
		}
	},

	getLocalStorage: function (key) {
		if (Modernizr.localstorage) {
			var val = localStorage.getItem(key);
			return val;
		} else {
			console.log('Local Storage not supported!');
		}
	},

	formatSecondsAsTime: function (secs, format) {
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
	},

	setMainSectionWidth: function () {
		var mainWidth = window.innerWidth - 300;
        $('#main-section').css('width', mainWidth);
	},

	dialog: {
		elements: {
			overlay: '<div id="overlay"></div>',
			modal: '<div id="modal"><h1 id="message"></h1><form id="data"></form><button type="submit" id="submit-modal">Submit</button></div>'
		},

		custom: function(message, values, callback){
			//console.log(values);
			$('body').prepend(Utils.dialog.elements.overlay);
			$('#overlay').html(Utils.dialog.elements.modal);
			$('#message').html(message);
			
			for (var key in values) {
				console.log(values[key], key);

				//create dom element from object literal values[key]
				var element = $('<'+key+'>', values[key]);
				$('#data').append(element);
			}

			$('#submit-modal').click(function(e){
				e.preventDefault();
				console.log($('#data').serialize(), callback);
			});
		},

		savePlaylist: function (queue){
			$('body').prepend(Utils.dialog.elements.overlay);
			$('#overlay').html(Utils.dialog.elements.modal);
			$('#message').html('Playlist Name?');
			$('#data').append('<input type="text" name="name" id="name" />');
			$('#submit-modal').click(function(e){
				e.preventDefault();
				queue.name = $('#name').val();
				console.log(queue);
				Library.playlist.save(queue);
				$('#overlay').remove();
			});
		},
		
	},

	notifications: {

		requestPermission: function() {

			if (window.webkitNotifications.checkPermission() == 0) { 
				Utils.notifications.create('Shambala', 'Notifications Enabled');
			} else {
			    window.webkitNotifications.requestPermission();
			}

		},

		create: function(title, message){
			if (window.webkitNotifications.checkPermission() == 0) {
				//permission is enabled
			    notif = window.webkitNotifications.createNotification(
			      'icon.png', title, message);

			    notif.ondisplay = function() {
			    	setTimeout(function(){
			    		notif.close();
			    	}, 3000);
			    };

			    notif.show();
			} else {
				window.webkitNotifications.requestPermission();
			}
		}
	},

	objLiteralConvert: function(lit) {
		var obj = {};
		for (var key in lit) {
			if (lit.hasOwnProperty(key)) {
				var obj = lit[key]
				return obj;
				/* for (var prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						console.log('obj[prop]', obj[prop]);
					}
				} */
			}
		}
	}
}

$(function(){
	Utils.init();
});