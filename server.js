var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server, {origins: '*:*'}),
    params = require('express-params'),
	//events = require('events'),
    
    fs = require('fs'),
    file = require('file'),
    
    mongoose = require('mongoose'),
    hbs = require('hbs');
    
    params.extend(app);
    //server = http.createServer(app),
    //mongo = require('mongojs'),
    //ObjectId = mongo.ObjectId;
    //io = require('socket.io').listen(server),
    //sanitize = require('validator').sanitize;
    //$ = require('jquery');

var clients = {};

io.sockets.on('connection', function(socket){
    //console.log('session id', socket.handshake.sessionID);

    var address = socket.handshake.address,
        ip = address.address + ":" + address.port;

    clients[address.address] = address.port;
    
    console.log('current connected clients: ', clients);
    socket.emit('updateClients', ip, clients);

});
//upnp prototype
//require('./prototypes/upnp/upnp.js');

//upnp prototype
//require('./prototypes/id3/id3.js');

var file = "D:\\test.mp4";

//batch jobs
//require('./config/batch.js')(file);

//require('./config/vlc.js')(file);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// Trim by Mozilla Developer Network
String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

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
    app.use('/music', express.static(__dirname + '/public/music'));
    app.use('/media', express.static('D:/'));
    app.use('/views', express.static(__dirname + '/public/views'));

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
//var server = app.listen(8080);

/* io.sockets.on('connect', function(socket){
    console.log('socket connected!', socket);
}); */

server.listen(8080);