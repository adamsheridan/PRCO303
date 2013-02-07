var Fx = {

	elements: {
		queue: $('#queue')
	},

	animateQueue: function () {
		queue.animate({ 'bottom': '80px'});
	}

	flashQueue: function() {
		console.log('audio init');
		//Audio.elements();
		Audio.events();
	}
}