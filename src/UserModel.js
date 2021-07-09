const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
	ID: {
		type: Number, 
		min: [0, "ID must be positive."]
	},
	name: {
		type: String, 
		required: true,
		maxlength: 15
	},
	password: {
		type: String,
		required: [true, "You need a password."],
		min: [3, "Password must be at least length 3"]
	},
	userType: {
		type: String
	},
	followingPeople: {
			type: [Number],
			ref: "People"
		},
	followingUsers:{
			type: [Number],
			ref: "User"
		},
	followers: {
			type: Array,
			ref: "User"
		},
	watchedMovies: {
			type: [Number],
			ref: "Movie"
		},
	recommendedMovies: {
			type: [Number],
			ref: "Movie"
		},
	reviews: {
			type: [Number],
			ref: "Review"
		},
	userNotifications: {
		type: [Number]
	},
	peopleNotifications: {
		type: [String]
	}
	
});


userSchema.virtual('followingP', {
  ref: 'People',
  localField: 'followingPeople',
  foreignField: 'ID',
});
userSchema.virtual('followingU', {
  ref: 'User',
  localField: 'followingUsers',
  foreignField: 'ID',
});
userSchema.virtual('follows', {
  ref: 'User',
  localField: 'followers',
  foreignField: 'ID',
});
userSchema.virtual('watchedFilms', {
  ref: 'Movie',
  localField: 'watchedMovies',
  foreignField: 'ID',
});
userSchema.virtual('recommendedFilms', {
  ref: 'Movie',
  localField: 'recommendedMovies',
  foreignField: 'ID',
});
userSchema.virtual('rvws', {
  ref: 'Review',
  localField: 'reviews',
  foreignField: 'ID',
});
userSchema.virtual('uNotif', {
  ref: 'Review',
  localField: 'userNotifications',
  foreignField: 'ID',
});
// userSchema.virtual('pNotif', {
//   ref: 'Movie',
//   localField: 'peopleNotifications',
//   foreignField: 'ID',
// });




module.exports = mongoose.model("User", userSchema);