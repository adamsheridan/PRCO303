// ./config/config.js

module.exports = function(app) {

	app.set('views', __dirname + '/app/views');
	app.set('view engine', 'html');
	app.engine('html', require('hbs').__express);

	
	//app.use(express.static(__dirname + '/public'));

}