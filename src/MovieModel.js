const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let movieSchema = Schema({
	ID: {
		type: Number, 
		min: [0, "ID must be positive."]
	},
	averageRating: {
		type: Number
	},
	title: {
		type: String,
		required: [true, "You need a title."],
		min: 0
	},
	releaseYear: {
		type: Number,
		required: [true, "You need a releaseYear."],
		min: 0
	},
	runtime: {
		type: Number,
		required: [true, "You need a runtime."],
		min: 0
	},
	plot: {
		type: String,
		required: [true, "You need a plot."],
		min: 0
	},
	genres: {
		type: Array,
		required: [true, "You need genre(s)."]
	},
	directors: {
		type: [Number],
		required: [true, "You need a director(s)."]
	},
	writers: {
		type: [Number],
		required: [true, "You need a writer(s)."]
	},
	actors: {
		type: [Number],
		required: [true, "You need a actor(s)."]
	},
	reviews:{
		type: [Number],
		ref: "Review"
	}
});
movieSchema.virtual('dir', {
  ref: 'People',
  localField: 'directors',
  foreignField: 'ID',
});

movieSchema.virtual('writ', {
  ref: 'People',
  localField: 'writers',
  foreignField: 'ID',
});
movieSchema.virtual('act', {
  ref: 'People',
  localField: 'actors',
  foreignField: 'ID',
});
movieSchema.virtual('rvws', {
  ref: 'Review',
  localField: 'reviews',
  foreignField: 'ID',
});



module.exports = mongoose.model("Movie", movieSchema);