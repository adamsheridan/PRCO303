var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MovieSchema = new Schema({
    id: ObjectId,
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
    poster: { type: String, required: true },
    rating: { type: Number, reqired: true },
    release_date: { type: String, required: true },
    src: { type: String, required: true }
});

mongoose.model('Movie', MovieSchema);