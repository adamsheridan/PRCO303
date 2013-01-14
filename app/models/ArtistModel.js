var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ArtistSchema = new Schema({
    id: ObjectId,
    name: { type: String, required: true }
});

ArtistSchema.path('name').validate(function (name){
	return name.length > 0
}, 'Artist Name cannot be blank');

mongoose.model('Artist', ArtistSchema);