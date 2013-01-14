// library controller
// ./app/controllers/library.js

exports.index = function (req, res){
	console.log('library index controller');
	
	res.render('test', {
		users: [
			{username: 'asheridan', firstName: 'Adam', lastName: 'Sheridan'},
            {username: 'sbrown', firstName: 'Sam', lastName: 'Brown'},
            {username: 'bollins', firstName: 'Bo', lastName: 'Llins'}
		]
	});
}