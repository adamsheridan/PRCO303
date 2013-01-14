var express = require('express'),
	events = require('events'),
    http = require('http'),
    fs = require('fs'),
    file = require('file'),
    app = express(),
    mongoose = require('mongoose'),
    hbs = require('hbs');
    //server = http.createServer(app),
    //mongo = require('mongojs'),
    //ObjectId = mongo.ObjectId;
    //io = require('socket.io').listen(server),
    //sanitize = require('validator').sanitize;
    //$ = require('jquery');

mongoose.connect('mongodb://localhost/prco303');

app.use(express.bodyParser());

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

var libraryPath = '/Users/adam/Music/iTunes/iTunes Media/Music/';

// configuration + routing
//require('./config/config.js')(app);

app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

/* app.use('/images', express.static(__dirname + '/public/images'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/fonts', express.static(__dirname + '/public/fonts')); */

console.log('#############################################################\nDebug');
//console.log('app.routes', app.routes);

require('./config/routes.js')(app, express);

app.listen(8080);