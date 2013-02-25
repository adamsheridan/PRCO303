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
        console.log('widthSet');
	}
}

$(function(){
	Utils.init();
});