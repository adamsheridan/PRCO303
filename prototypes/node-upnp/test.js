var upnp = require('upnp-device');
var mediaServer = upnp.createDevice('MediaServer', 'My Media Application');

/*    mediaServer.addMedia(0, media, function(err, id) {
        console.log("Added new media with ID:" + id);
    });
    mediaServer.announce();
});*/