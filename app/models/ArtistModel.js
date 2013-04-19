var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ArtistSchema = new Schema({
    id: ObjectId,
    name: { type: String, required: true, unique: true },
    musicbrainzId: {type: String, required: true }
});

ArtistSchema.path('name').validate(function (name){
	return name.length > 0
}, 'Artist Name cannot be blank');

ArtistSchema.statics.findAll = function (callback) {
	console.log('findAll method');
	return this.model('Artist').find({}, callback);
}

mongoose.model('Artist', ArtistSchema);