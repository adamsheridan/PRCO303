var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReleaseSchema = new Schema({
    id: ObjectId,
    artistid: { type: ObjectId, required: true, default: '50f6b41bd4c2de54b0ffe47a'},
    type: { type: String, required: true, default: 'release'},
    title: { type: String, required: true }
});

/* ReleaseSchema.path('title').validate(function (name){
	return title.length > 0
}, 'Release Title cannot be blank');
*/

mongoose.model('Release', ReleaseSchema);