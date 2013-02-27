var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PlaylistSchema = new Schema({
    id: ObjectId,
    name: { type: String, required: true, unique: true },
    obj: { type: String, require: true }
});

mongoose.model('Playlist', PlaylistSchema);