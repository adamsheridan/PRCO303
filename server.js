var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    params = require('express-params'),
    fs = require('fs'),
    file = require('file'),
    mongoose = require('mongoose'),
    hbs = require('hbs');
    params.extend(app);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var clients = {};

io.sockets.on('connection', function(socket){
    //console.log('session id', socket.handshake.sessionID);

    //console.log('socket is:', socket);
    console.log('socketid', socket.id);

    var address = socket.handshake.address,
        ip = address.address + ":" + address.port;

    clients[socket.id] = ip;
    console.log('current connected clients: ', clients);

    socket.emit('updateClients', ip, clients);

    socket.broadcast.emit('updateClients', ip, clients);

    socket.on('play-to', function(obj){
        console.log('PLAY TO', obj);
        var id = obj.target;
        io.sockets.socket(id).emit('play-here', obj);
    });
    
    // disconnection
    socket.on('disconnect', function(){
        // remove own key from clients
        for (var key in clients) {
            console.log('key is', key);
            if (key == socket.id) {
                delete clients[key];
            }
            
        }

        console.log('DISCONNECT from ', ip);
        console.log('clients is', clients);

        socket.broadcast.emit('updateClients', ip, clients);

    });

});


// Trim by Mozilla Developer Network
String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

// configure application
app.configure(function(){

    app.set('title', 'PRCO303');
    app.set('views', __dirname + '/app/views');
    app.use(require('connect').bodyParser());
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

server.listen(8080);