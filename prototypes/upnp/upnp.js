var upnp = require('upnp-device');
var mediaServer = upnp.createDevice('MediaServer', 'My Media Application'),
    redis = require('redis'),
    client = redis.createClient();

/*    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });*/

/*client.on('error', function(err){
    console.log('Error: ', err, client);
});

client.on('ready', function(err){
    console.log('ready');
});*/

mediaServer.on('ready', function(a) {
   console.log('ready', a);

   item = {
        'class': 'object.item.audioItem.musicTrack',
        'title': 'Bring Back Pluto',
        'creator': 'Aesop Rock',
        'location': 'D:/Music/Aesop Rock/None Shall Pass/04 Bring Back Pluto.mp3',
        'album': 'None Shall Pass'
    };

   var media = item;

   mediaServer.addMedia(0, media, function(err, id) {
        if (err) console.log(err);
        console.log("Added new media with ID:" + id);
    });
    //mediaServer.announce();
});
