const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let peopleSchema = Schema({
	ID: {
		type: Number, 
		min: [0, "ID must be positive."]
	},
	name: {
		type: String, 
		required: true,
		maxlength: 25
	},
	prevDirectingWork: {
		type: [Number]
	},
	prevWritingWork: {
		type: [Number]
	},
	prevActingWork: {
		type: [Number]
	},
	frequentCollaborators: {
		type: [Number]
	},
	followers: {
		type: [Number]
	}
});
peopleSchema.virtual('prevDW', {
  ref: 'Movie',
  localField: 'prevDirectingWork',
  foreignField: 'ID',
});
peopleSchema.virtual('prevWW', {
  ref: 'Movie',
  localField: 'prevWritingWork',
  foreignField: 'ID',
});
peopleSchema.virtual('prevAW', {
  ref: 'Movie',
  localField: 'prevActingWork',
  foreignField: 'ID',
});
peopleSchema.virtual('freqC', {
  ref: 'People',
  localField: 'frequentCollaborators',
  foreignField: 'ID',
});



module.exports = mongoose.model("People", peopleSchema, 'people');