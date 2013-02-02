var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SongSchema = new Schema({
    id: ObjectId,
    type: { type: String, required: true, default: 'song'},
    artist: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true }
});

/* ReleaseSchema.path('title').validate(function (name){
	return title.length > 0
}, 'Release Title cannot be blank');
*/

mongoose.model('Song', SongSchema);