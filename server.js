var express = require('express'),
    params = require('express-params'),
	events = require('events'),
    http = require('http'),
    fs = require('fs'),
    file = require('file'),
    app = express(),
    mongoose = require('mongoose'),
    hbs = require('hbs');

    params.extend(app);
    //server = http.createServer(app),
    //mongo = require('mongojs'),
    //ObjectId = mongo.ObjectId;
    //io = require('socket.io').listen(server),
    //sanitize = require('validator').sanitize;
    //$ = require('jquery');

var libraryPath = '/Users/adam/Music/iTunes/iTunes Media/Music/';

// configure application
app.configure(function(){

    app.set('title', 'PRCO303');
    app.set('views', __dirname + '/app/views');
    app.use(express.bodyParser());
    app.set('view engine', 'html');
    app.engine('html', require('hbs').__express);

    app.use('/images', express.static(__dirname + '/public/images'));
    app.use('/css', express.static(__dirname + '/public/css'));
    app.use('/js', express.static(__dirname + '/public/js'));
    app.use('/fonts', express.static(__dirname + '/public/fonts'));

    console.log('views: ', app.get('views'));

});

// require models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// require routes
require('./config/routes.js')(app, express);

// register partial views
require('./config/registerPartials.js')(app, express);

// start connection to database
mongoose.connect('mongodb://localhost/prco303');

// start application
app.listen(8080);