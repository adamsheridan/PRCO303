var fs = require('fs'),
	hbs = require('hbs'),
	dirPartials = __dirname + '/../app/views/partials',
	partials = fs.readdirSync(dirPartials);

module.exports = function (app, express) {
	partials.forEach(function(file){
		var matches = /^([^.]+).html$/.exec(file);
		if (!matches) {
			return;
		}

		var name = matches[1],
			template = fs.readFileSync(dirPartials + '/' + file, 'utf8');

		hbs.registerPartial(name, template);
		console.log('registered partial: ', name);
	});
}