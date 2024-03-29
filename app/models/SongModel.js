var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SongSchema = new Schema({
    id: ObjectId,
    type: { type: String, required: true, default: 'song'},
    artistid: { type: ObjectId, required: true },
    releaseid: ObjectId,
    title: { type: String, required: true },
    location: { type: String, required: true },
    plays: { type: Number, required: true, default: '0'},
    lastPlay: { type: Number }
});

/* ReleaseSchema.path('title').validate(function (name){
	return title.length > 0
}, 'Release Title cannot be blank');
*/

mongoose.model('Song', SongSchema);