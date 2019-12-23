const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  placeName: {
    type: String,
    required: true
  },
  urlSlug: {
    type: String,
    required: true,
    unique: true
  },
  placeDescription: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Place = mongoose.model("place", PlaceSchema);
