const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = Schema({
	ID: {
		type: Number, 
		min: [0, "ID must be positive."],
		ref: "Movie"
	},
	movieID: {
		type: Number,
		ref: "Movie"
	},
	movieTitle: {
		type: String
	},
	rating: {
		type: Number,
		required: true
	},
	summary: {
		type: String
	},
	fullReview: {
		type: String,
	},
	user: {
		type: String,
		required: true
	},
	userID: {
		type: Number,
		required: true
	},
	type: {
		type: String
	}
});
reviewSchema.virtual('film', {
  ref: 'Movie',
  localField: 'movieID',
  foreignField: 'ID',
});



module.exports = mongoose.model("Review", reviewSchema);