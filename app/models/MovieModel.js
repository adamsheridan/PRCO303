var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MovieSchema = new Schema({
    id: ObjectId,
    title: { type: String, required: true },
    location: { type: String, required: true }
});

mongoose.model('Movie', MovieSchema);