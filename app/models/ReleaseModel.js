var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReleaseSchema = new Schema({
    id: ObjectId,
    artistid: { type: ObjectId, required: true },
    type: { type: String, required: true, default: 'release'},
    title: { type: String, required: true },
    year: { type: String },
    id3image: { type: String }
});

/* ReleaseSchema.path('title').validate(function (name){
	return title.length > 0
}, 'Release Title cannot be blank');
*/

mongoose.model('Release', ReleaseSchema);