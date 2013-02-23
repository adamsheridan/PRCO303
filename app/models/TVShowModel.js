var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TVShowSchema = new Schema({
    id: ObjectId,
    title: { type: String },
    tvshow: { type: String, required: true },
    season: { type: Number },
    episode: { type: Number },
    location: { type: String, required: true }
});

/* ReleaseSchema.path('title').validate(function (name){
	return title.length > 0
}, 'Release Title cannot be blank');
*/

mongoose.model('TVShow', TVShowSchema);