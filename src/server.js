//EXPRESS AND REQUEST SIDE
const express = require('express');
const session = require('express-session')
const app = express();

// Use the session middleware
app.use(session({ secret: 'some secret here'}))

//app.locals -- a storage for local server information
app.locals.config = require("./config.json");
//use Pug
app.set("view engine", "pug");


//Automatically parse JSON data
app.use(express.json());

//Use views folder
app.use(express.static('views'));
app.use(express.urlencoded({extended: true}));

//Mongoose
const mongoose = require("mongoose");
//Require models/schemas used for users,movies,reviews and people
const User = require("./UserModel");
const Movie = require("./MovieModel");
const People = require("./PeopleModel");
const Review = require("./ReviewModel");


//Check what is being requested on what url and what path
app.use(function(req,res,next){
	console.log(req.method);
	console.log(req.url);
	console.log(req.path);
	next();
});


//USER SPECIFIC
//Home Page - Login - Logout - New User(get and post) - User Search - Specific User
app.get("/", (req, res, next)=> { res.render("homepage", {session: req.session}); });
app.get("/loginpage", (req, res, next)=> { res.render("loginpage", {session: req.session}); });
app.post("/loginpage", login);
app.get("/logout", logout); 
app.get("/createnewuser", (req, res, next)=> { res.render("createnewuser", {session: req.session}); });
app.post("/createnewuser", createNewUser);
app.get("/users", queryParserUsers);
app.get("/users", getUsers);
app.get("/users/:id", getUser);
//app.get("/users/:id", authorizeUserPageView, verified);
//Updating user info
app.post("/users/:id", updateUser);
app.post("/users/:id/removedMovies", unwatchMovieFromUserPage);
app.post("/users/:id/followedU", verifyLoggedIn, followNewUser);
app.post("/users/:id/unfollowedU", verifyLoggedIn, unfollowUser);
app.post("/users/:id/removedUNotifications", removeUNotification);
app.post("/users/:id/removedPNotifications", removePNotification);


//MOVIE SPECIFIC
//GET request - get create movie page
app.get("/createmovie", (req, res, next)=> { res.render("createmovie", {session: req.session}); });
//POST request - create movie
app.post('/createmovie', verifyLoggedIn, verifyUserType, createMovie);

//Search movies
app.get("/movies", queryParserMovies);
app.get("/movies", getMovies);
//Specific movie page - dynamic
app.get("/movies/:id", getMovie);
app.post("/movies/:id/watchedMovies", watchMovie);
app.post("/movies/:id/unwatchedMovies", unwatchMovie);
//REVIEW SPECIFIC - Child of movie
app.get("/movies/:id/reviews/:rid", getReview);
app.post("/movies/:id/reviews", createNewReview);


//PEOPLE SPECIFIC
//Create person page
app.get("/createperson", (req, res, next)=> { res.render("createperson", {session: req.session}); });
app.post("/createperson", createNewPerson);
//Search people
app.get("/people", queryParserPeople);
app.get("/people", getPeople);
//Specific Person - dynamic
app.get("/people/:id", getPerson);
//Follow person
app.post("/followP/:id", verifyLoggedIn, followNewPerson);
//Unfollow person
app.post("/unfollowP/:id", verifyLoggedIn, unfollowPerson);
app.post("/getDirectors", getDirectors);
app.post("/getWriters", getWriters);
app.post("/getActors", getActors);






//HELPER FUNCTIONS

/* USER RELATED FUNCTIONS */
	//Login the user (mongoose)
	function login(req,res,next){
		if(req.session.loggedin){
			res.status(200).send("Already logged in.");
			return;
		}

		let name = req.body.name;
		let password = req.body.password;

		console.log("Logging in with credentials:");
		console.log("Username: " + req.body.name);
		console.log("Password: " + req.body.password);

		User.findOne({name: name}).exec(function(err,user){
			if(err){
				console.log(err);
				res.status(500).send("error finding user to login");
			}
			console.log("user",user);
			if(!user){
				res.status(401).send("Unauthorized");
				return;
			}
			if(user.password === req.body.password){
				req.session.loggedin = true;
				req.session.name = name;
				req.session.userID = user.ID;
				res.status(200).send("Logged in");
			}else{
				console.log("Invalid password/username");
				res.status(401).send("Not authorized. Invalid password.");
			}
		});
	}

	//Logout the user
	function logout(req, res, next){
		if(req.session.loggedin){
			req.session.loggedin = false;
	    	req.session.username = undefined;
	    	req.session.userID = undefined;
			res.status(200).send("Logged out.");
		}else{
			res.status(200).send("You cannot log out because you aren't logged in.");
		}
	}

	//Get User (using mongoose)
	function getUser(req,res,next){
		if(!req.session.loggedin || parseInt(req.params.id) !== req.session.userID){
			/* USING DATABASE */
			let isFollowing = false;
			User.findOne({ID: req.params.id}).populate('followingP').populate('watchedFilms')
			.populate('followingU').populate('follows').populate('rvws')
			.exec(function (err, user) {
		       if (err){ console.log(err); res.status(500).send("error finding user info 1"); }
		       console.log("USer", user);
		       console.log("The watchedMovies are " + user.watchedFilms);
		       console.log("The people this user is following are " + user.followingP);
		       console.log("The users this user is following are " + user.followingU);
		       console.log("this users followers: " + user.follows);
		       console.log("This users reviews: " + user.rvws);
		       User.findOne({ID: req.session.userID}).populate('followingU').exec(function(err2,sessUser){
		       		 if (err2){ console.log(err2); res.status(500).send("error finding user info 2"); }
		       		 if(req.session.loggedin){
				       	 sessUser.followingU.forEach(function(u){
				       		console.log("Comparing " + u.ID + " with " + req.params.id);
				       		if(u.ID === parseInt(req.params.id)){
				       			isFollowing = true;
				       		}
				      	 });
			       	 }
			         res.render("user", {user: user, watchedMovies: user.watchedFilms, followingP: user.followingP,
									moviesReviewed: user.rvws, followers: user.follows,
									followingU: user.followingU || [], isFollowing: isFollowing, session: req.session});
			         return;
		       });
		       
		    });
		}
		else{
			User.findOne({ID: req.params.id}).populate('followingP').populate('watchedFilms')
			.populate('followingU').populate('follows').populate('recommendedFilms')
			.populate('rvws').populate('uNotif')
			.exec(function (err, user) {
		       if (err){
		       	 console.log("err");
		       	 res.status(500).send("problem getting user");
		       }
		       let notifications = [];
		       let notificationMovieIDs = [];
		       user.peopleNotifications.forEach(function(n){
		       		let stringArray = n.split("*");
		       		notifications.push(stringArray[0]);
		       		notificationMovieIDs.push(stringArray[1]);
		       });
			   res.render("userverified", {user: user, watchedMovies: user.watchedFilms, 
			   	followingP: user.followingP, moviesReviewed: user.rvws, recommendedM: user.recommendedFilms,
				followers:user.follows, followingU: user.followingU, pNotifications: notifications, 
				pNotificationsMID: notificationMovieIDs, session: req.session});
			});
		}
		return;
	}

	//Verify user is logged in
	function verifyLoggedIn(req,res,next){
		if(!req.session.loggedin){
			console.log("Not logged in..");
			res.status(401).send("Need to login first.");
			return;
		}
		next();
	}
	//Verify user type (mongoose)
	function verifyUserType(req,res,next){
		let sID = req.session.userID;
		User.findOne({ID: sID}).exec(function(err,user){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			if(user.userType !== "Contributing"){
				console.log("Not a contributing user.");
				res.status(401).send("Not a contributing user. Access Denied.");
				return;
			}
			next();
		});
	}

	//User can follow new user (using mongoose)
	function followNewUser(req,res,next){
		let sID = req.session.userID;
		let uID = parseInt(req.params.id);
		//Update user
		User.updateOne({ID: sID}, {$push: {followingUsers: uID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error following user");
				return;
			}
			console.log("follow new user: ", result);
			//res.status(200).send("Followed new user");
			updateUFollowers(uID, sID);
			res.status(200);
			res.redirect("/users/"+req.params.id);
		});
	}
	//Update the users followers (using mongoose)
	function updateUFollowers(uID, followingID){
		User.updateOne({ID: uID}, {$push: {followers: followingID} }).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error following user");
				return;
			}
			console.log("Updated followers");
		});
	}


	//Unfollow user (using mongoose)
	function unfollowUser(req,res,next){
		let sID = req.session.userID;
		let uID = parseInt(req.params.id);
		//Update sessions followingUsers
		User.updateOne({ID: sID}, {$pull: {followingUsers: uID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error updating when unfollowing");
				return;
			}
			//Update params followers
			updateUnfollow(uID, sID);
			//Send status - redirect to current page
			res.status(200);
			res.redirect("/users/"+req.params.id);
			return;
		})
		
	}
	//Update the user who got unfollowed (mongoose)
	function updateUnfollow(uID, followingU){
		User.updateOne({ID: uID}, {$pull: {followers: followingU} }).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error updating followers");
				return;
			}
			console.log("Updated followers");
		});
	}

	//Create new user (using mongoose)
	function createNewUser(req,res,next){
		//Check database count for users
		User.countDocuments({}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("Error counting users.");
				return;
			}
			console.log("User count = " + result);
			//Check if passwords match
			if(req.body.password !== req.body.passwordMatch){
				res.status(403).send("Passwords dont match");
				return;
			}
			User.findOne({name: req.body.name}).exec(function(err2, result2){
				if(err2){
					console.log(err2);
					res.status(500).send("Error finding user with name.");
					return;
				}
				console.log("Result = " + result2);
				if(!result2){
					let u = new User({ID: result, name: req.body.name,password:req.body.password,
					userType:"regular",followingPeople:[], followingUsers:[],
	 				followers:[],watchedMovies:[],recommendedMovies:[],reviews:[],userNotifications:[],peopleNotifications:[]});
	 				u.save(function(err3, result3){
						if(err3){
							console.log(err3);
							res.status(500).send("Error creating user.");
							return;
						}
						res.status(201).send("Created new user");
					})

				}
				else{
					res.status(403).send("User already exists");
				}
			})
			
		})
	}

	//Update user (using mongoose)
	function updateUser(req,res,next){
		let uType = req.body.userType;
		console.log("regular button is = " + uType);
		let uID = parseInt(req.session.userID);
		console.log("userID = ", uID);
		if(uType === undefined){
			res.status(403).send("You have not selected anything");
			return;
		}
		User.updateOne({ID: uID}, {$set: {userType: uType}},function(err,result){
			if (err){
		        console.log(err)
		        res.status(500).send("err updating");
		        return;
		    }
		    console.log("result = ",result);
		    res.status(200).send("Updated!");
		});
	}

	//Get User (using mongoose)
	function getUsers(req,res,next){
		let amount = 10;
		let startIndex = ((req.query.page-1) * amount);

		User.find().where("name").regex(new RegExp(".*" + req.query.nameSearch + ".*", "i"))
		.select('name ID followers')
		.limit(amount)
		.skip(startIndex)
		.exec(function(err, results){
			if(err){
				res.status(500).send("Error reading users.");
				console.log(err);
				return;
			}
			console.log("Found " + results.length + " matching users.");
			res.products = results;
			res.render("users", {users: results, qstring: req.qstring, current: req.query.page, session: req.session}); 
			return;
		})
	}

	//Remove user notification
	function removeUNotification(req,res,next){
		console.log('Got body:', req.body);
		console.log('n:', Number(req.body.n));
		User.updateOne({ID: req.params.id}, {$pull: {userNotifications: Number(req.body.n)}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			console.log("Result of removing notification",result);
			res.sendStatus(200);
		})
	}
	//Remove person notification
	function removePNotification(req,res,next){
		console.log('Got body:', req.body);
		console.log('n:', req.body.n);
		User.updateOne({ID: req.params.id}, {$pull: {peopleNotifications: req.body.n}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}
			console.log("Result of removing notification",result);
			res.sendStatus(200);
		})
	}



/* MOVIE RELATED FUNCTIONS */
	//Create movie (using mongoose)
	function createMovie(req,res,next){
		console.log('Got body:', req.body);
		//Check if forms are filled
		if(req.body.title.length === 0 || req.body.releaseYear === ""
			|| req.body.runtime === "" || req.body.plot === ""
			|| req.body.genres.length === 0 || req.body.directors.length === 0
			|| req.body.writers.length === 0 || req.body.actors.length === 0){
			res.sendStatus(403);
			return 
		}
		//Save movie
		console.log("req body for creating movie = " + req.body);
		Movie.countDocuments({}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("Error counting movies.");
				return;
			}
			console.log("Movie count = " + result);
			req.body.ID = result;
			People.find({ name: {$in: req.body.directors}}).exec(function(err2,result2){
				if(err2){
					console.log(err2);
					res.status(500).send("Error finding directors.");
					return;
				}
				let directorIDs = [];
				result2.forEach(function(p){
					directorIDs.push(p.ID);
				});
				People.find({ name: {$in: req.body.writers}}).exec(function(err3,result3){
					if(err3){
						console.log(err3);
						res.status(500).send("Error finding writers.");
						return;
					}
					let writerIDs = [];
					result3.forEach(function(p){
						writerIDs.push(p.ID);
					});
					People.find({ name: {$in: req.body.actors}}).exec(function(err4,result4){
						if(err4){
							console.log(err4);
							res.status(500).send("Error finding directors.");
							return;
						}
						let actorIDs = [];
						result4.forEach(function(p){
							actorIDs.push(p.ID);
						});
						req.body.directors = directorIDs;
						req.body.writers = writerIDs;
						req.body.actors = actorIDs;
						let movie = new Movie(req.body);
						console.log("movie = ", movie);
						movie.save(function(err5,result5){
							if(err5){
								console.log(err5);
								res.status(500).send("Error saving movie.");
								return;
							}
							//Call another function that updates Directors/ Actors / Writers
							updateDirectors(directorIDs, result);
							updateWriters(writerIDs, result);
							updateActors(actorIDs, result);

							//Update frequent collabs
							updateFreqCollabs(directorIDs, result);
							updateFreqCollabs(writerIDs, result);
							updateFreqCollabs(actorIDs, result);
							//Call another function to send notifications to users that follow these people
							sendNewMovieNotifications(directorIDs, writerIDs, actorIDs, req.body);
							res.status(201).send("created movie");
						});
					});
				});
			});
		});
	}
	//Send notifications to users who follow the people in the new movie
	function sendNewMovieNotifications(dIDArray, wIDArray,aIDArray, movie){
		//Send notifications to followers of directors
		User.find({followingPeople: {$in: dIDArray}}).populate('followingP')
		.exec(function(err,users){
			if(err){
				console.log(err);
				res.status(500).send("Error finding users to update for new movie");
			}
			users.forEach(function(u){
				let stringArray = [];
				const includedDirectors = u.followingP.filter(function(value){
					 return dIDArray.includes(value.ID);
				});
				includedDirectors.forEach(function(d){
					let string =  d.name +" has directed a new movie: "+movie.title+"*"+movie.ID;
					stringArray.push(string);
				});
				User.updateOne({ID: u.ID}, {$push: {peopleNotifications: stringArray}}).exec(function(err2, result){
					if(err){
						console.log(err);
						res.status(500).send("Error updating users about new movie");
					}
				});
			});
		});
		//Send notifications to followers of writers
		User.find({followingPeople: {$in: wIDArray}}).populate('followingP')
		.exec(function(err,users){
			if(err){
				console.log(err);
				res.status(500).send("Error finding users to update for new movie");
			}
			users.forEach(function(u){
				let stringArray = [];
				const includedWriters = u.followingP.filter(function(value){
					 return wIDArray.includes(value.ID);
				});
				includedWriters.forEach(function(w){
					let string =  w.name +" has written for a new movie: "+movie.title+"*"+movie.ID;
					stringArray.push(string);
				});
				User.updateOne({ID: u.ID}, {$push: {peopleNotifications: stringArray}}).exec(function(err2, result){
					if(err){
						console.log(err);
						res.status(500).send("Error updating users about new movie");
					}
				});
			});
		});
		//Send notifications to followers of actors
		User.find({followingPeople: {$in: aIDArray}}).populate('followingP')
		.exec(function(err,users){
			if(err){
				console.log(err);
				res.status(500).send("Error finding users to update for new movie");
			}
			users.forEach(function(u){
				let stringArray = [];
				const includedActors = u.followingP.filter(function(value){
					 return aIDArray.includes(value.ID);
				});
				includedActors.forEach(function(a){
					let string =  a.name +" has acted in a new movie: "+movie.title+"*"+movie.ID;
					stringArray.push(string);
				});
				User.updateOne({ID: u.ID}, {$push: {peopleNotifications: stringArray}}).exec(function(err2, result){
					if(err){
						console.log(err);
						res.status(500).send("Error updating users about new movie");
					}
				});
			});
		});
	}

	//Update directors (mongoose)
	function updateDirectors(dArray, mID){
		People.find({ID: {$in: dArray}}).exec(function(err,people){
			if(err){
				console.log(err);
				res.status(500).send("Error finding people to update directors");
				return;
			}
			console.log("Updating directors:",people);
			people.forEach(function(p){
				People.updateOne({ID: p.ID}, { $push: { prevDirectingWork: mID } }).exec(function(err2,person){
					if(err){
						console.log(err);
						return;
					}
					console.log("Updated successfully", person);
				});
			});
		});
	}
	//Update writers (mongoose)
	function updateWriters(wArray, mID){
		People.find({ID: { $in: wArray}}).exec(function(err,people){
			if(err){
				console.log(err);
				res.status(500).send("Error finding people to update writers");
				return;
			}
			console.log("Updating writers:",people);
			people.forEach(function(p){
				People.updateOne({ID: p.ID}, { $push: { prevWritingWork: mID } }).exec(function(err2,person){
					if(err){
						console.log(err);
						return;
					}
					console.log("Updated successfully", person);
				});
			});
		});
	}
	//Update actors (mongoose)
	function updateActors(aArray, mID){
		People.find({ID: { $in: aArray}}).exec(function(err,people){
			if(err){
				console.log(err);
				res.status(500).send("Error finding people to update actors");
				return;
			}
			console.log("Updating actors:",people);
			people.forEach(function(p){
				People.updateOne({ID: p.ID}, { $push: { prevActingWork: mID } }).exec(function(err2,person){
					if(err){
						console.log(err);
						return;
					}
					console.log("Updated successfully", person);
				});
			});
		});
	}
	//Update the frequent collaborators
	function updateFreqCollabs(people, mID){
		people.forEach(function(personID){
			let peopleInSameMovie = [];
			console.log(personID);
			//Get all movies this person has worked on and the people they have worked with
			Movie.find({directors: personID}).exec(function(err,movie1){
				if(err){
					console.log(err);
					res.sendStatus(500);
					return;
				}
				Movie.find({writers: personID}).exec(function(err2,movie2){
					if(err2){
						console.log(err2);
						res.sendStatus(500);
						return;
					}
					Movie.find({actors: personID}).exec(function(err3,movie3){
						if(err3){
							console.log(err3);
							res.sendStatus(500);
							return;
						}
						//Concat all the people together to compile list of people who have worked with this person
						let p1 = []; let p2 = []; let p3 = [];
						if(movie1.length != 0){
							movie1.forEach(function(m1){
								m1.actors.forEach(function(m1a){
									if(m1a != personID){
										p1.push(m1a);
									}
								});
								m1.writers.forEach(function(m1w){
									if(m1w != personID){
										p1.push(m1w);
									}
								});
								m1.directors.forEach(function(m1d){
									if(m1d != personID){
										p1.push(m1d);
									}
								});
							});
						}
						if(movie2.length != 0){
							movie2.forEach(function(m2){
								m2.actors.forEach(function(m2a){
									if(m2a != personID){
										p2.push(m2a);
									}
								});
								m2.writers.forEach(function(m2w){
									if(m2w != personID){
										p2.push(m2w);
									}
								});
								m2.directors.forEach(function(m2d){
									if(m2d != personID){
										p2.push(m2d);
									}
								});
							});
						}
						if(movie3.length != 0){
							movie3.forEach(function(m3){
								m3.actors.forEach(function(m3a){
									if(m3a != personID){
										p3.push(m3a);
									}
								});
								m3.writers.forEach(function(m3w){
									if(m3w != personID){
										p3.push(m3w);
									}
								});
								m3.directors.forEach(function(m3d){
									if(m3d != personID){
										p3.push(m3d);
									}
								});
							});
						}
						peopleInSameMovie = peopleInSameMovie.concat(p1);
						peopleInSameMovie = peopleInSameMovie.concat(p2);
						peopleInSameMovie = peopleInSameMovie.concat(p3);

						//Count frequency
						let freqCollabs = [];
						let visited = [];
						for(let i = 0; i < peopleInSameMovie.length; i++){
							visited.push(false);
						}

						for(let i = 0; i < peopleInSameMovie.length; i++){
							if(visited[i] === true){
								continue;
							}
							let count = 1;
							freqCollabs.push({ID: peopleInSameMovie[i], freq: 1});
							for(let j = i + 1; j < peopleInSameMovie.length; j++){
								if(peopleInSameMovie[i] == peopleInSameMovie[j]){
									visited[j] = true;
									freqCollabs[freqCollabs.length-1].freq++;
									count++;
								}
							}
						}

						let freqCollabsIDs = [];
						//Sort the array in descending order
						freqCollabs.sort(function(a, b) {
						  return b.freq - a.freq;
						});

						if(freqCollabs.length > 5){
							freqCollabsIDs = [freqCollabs[0].ID, freqCollabs[1].ID, freqCollabs[2].ID, freqCollabs[3].ID, freqCollabs[4].ID,];
						}
						else{
							for(let i = 0; i < freqCollabs.length; i++){
								freqCollabsIDs.push(freqCollabs[i].ID);
							}
						}
						console.log("freq collabs IDs: ", freqCollabsIDs);
						//Update persons freq collab list
						People.updateOne({ID: personID}, {$set: {frequentCollaborators: freqCollabsIDs}}).exec(function(err4,result){
							if(err4){
								console.log(err4);
								res.sendStatus(500);
								return;
							}
						});
					});
				});
			});
		});
	}
	
	
	//Get movies (using mongoose)
	function getMovies(req,res,next){
		let amount = 10;
		let startIndex = ((req.query.page-1) * amount);
		
		Movie.find().where("title").regex(new RegExp(".*" + req.query.titleSearch + ".*", "i"))
		.where("genres").regex(new RegExp(".*" + req.query.genreSearch + ".*", "i"))
		.select('title ID directors writers actors releaseYear runtime')
		.populate('dir', 'name').populate('writ', 'name').populate('act', 'name')
		.limit(amount)
		.skip(startIndex)
		.exec(function(err, results){
			if(err){
				res.status(500).send("Error reading movies.");
				console.log(err);
				return;
			}
			console.log("Found " + results.length + " matching movies.");
			res.products = results;
			let matchingMovies = [];
			let pRegx = new RegExp(".*" + req.query.personSearch + ".*", "i");
			//Filter by people in the movie
			results.forEach(function(m){
				let flag = 0;
				m.dir.forEach(function(d){
					if(d.name.match(pRegx) && flag === 0){
						matchingMovies.push(m);
						flag = 1;
					}
				})
				m.writ.forEach(function(w){
					if(w.name.match(pRegx) && flag === 0){
						matchingMovies.push(m);
						flag = 1;
					}
				})
				m.writ.forEach(function(a){
					if(a.name.match(pRegx) && flag === 0){
						matchingMovies.push(m);
						flag = 1;
					}
				})
			});

			res.render("movies", {movies: matchingMovies, qstring: req.qstring, current: req.query.page, session: req.session}); 
			return;
		})
	}

	//Load single movie (with mongoose)
	function getMovie(req,res,next){
		let hasWatched = false;
		let loggedin = false;
		if(req.session.loggedin){
			loggedin = true;
			Movie.findOne({ID: parseInt(req.params.id)}).populate('dir').populate('rvws')
			.populate('writ').populate('act')
			.exec(function(err, movie){
				if(err){
					res.status(500).send("Error reading movies.");
					console.log(err);
					return;
				}
				console.log("Movie",movie);
				User.findOne({ID: req.session.userID}).exec(function(err2, user){
					if(err2){
						console.log(err2);
						res.status(500).send("err checking if user has seen this film");
					}
					user.watchedMovies.forEach(function(m){
						console.log("Comparing " + m + " with " + req.params.id);
						if(m == req.params.id){
							hasWatched = true;
						}
					});
					//GET SIMILAR MOVIES
					Movie.find({ID: {$ne: movie.ID}}).where("genres").regex(new RegExp(".*" + movie.genres[0] + ".*", "i")).exec(function(err3,movies){
						if(err3){
							console.log(err3);
							res.status(500).send("Error reading movies.");
							return;
						}
						let similarMovies = [];
						//Sort descending in terms of average rating
						movies.sort(function(a,b){
							return b.averageRating - a.averageRating;
						});
						if(movies.length > 5){
							similarMovies = [movies[0], movies[1], movies[2], movies[3], movies[4]];
						}
						else{
							movies.forEach(function(m){
								similarMovies.push(m);
							});
						}
						res.render("movie",{movie: movie, reviews: movie.rvws, directors: movie.dir,
								writers: movie.writ, actors: movie.act, loggedin: loggedin,
								hasWatched: hasWatched, similarMovies: similarMovies, session: req.session}); 
						return;
					});
				});
			})
		}
		else{
			Movie.findOne({ID: parseInt(req.params.id)}).populate('dir').populate('rvws')
			.populate('writ').populate('act')
			.exec(function(err, movie){
				if(err){
					res.status(500).send("Error reading movies.");
					console.log(err);
					return;
				}
				//GET SIMILAR MOVIES
				Movie.find({ID: {$ne: movie.ID}}).where("genres").regex(new RegExp(".*" + movie.genres[0] + ".*", "i")).exec(function(err3,movies){
					if(err3){
						console.log(err3);
						res.status(500).send("Error reading movies.");
						return;
					}
					let similarMovies = [];
					//Sort descending in terms of average rating
					movies.sort(function(a,b){
						return b.averageRating - a.averageRating;
					});
					if(movies.length > 5){
						similarMovies = [movies[0], movies[1], movies[2], movies[3], movies[4]];
					}
					else{
						movies.forEach(function(m){
							similarMovies.push(m);
						});
					}
					res.render("movie",{movie: movie, reviews: movie.rvws, directors: movie.dir,
							writers: movie.writ, actors: movie.act, loggedin: loggedin,
							hasWatched: hasWatched, similarMovies: similarMovies, session: req.session}); 
					return;
				});
			});
		}
	}

	//Watch movie (mongoose)
	function watchMovie(req,res,next){
		uID = req.session.userID;
		mID = parseInt(req.params.id);
		User.updateOne({ID:uID}, {$push: {watchedMovies: mID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("err trying to watch film");
			}
			console.log("Added to watched movie list");
			//Recalculate and update recommended movies
			updateRecommendedMovies(uID);
			res.status(200);
			res.redirect("/movies/"+mID);
		})
	}
	//Unwatch movie (mongoose)
	function unwatchMovie(req,res,next){
		uID = req.session.userID;
		mID = req.params.id;
		User.updateOne({ID:uID}, {$pull: {watchedMovies: mID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("err trying to unwatch film");
			}
			console.log("Removed from watched movie list");
			res.status(200);
			res.redirect("/movies/"+mID);
		})
	}
	//Unwatch movie from user page(mongoose)
	function unwatchMovieFromUserPage(req,res,next){
		let mID = parseInt(req.body.movie);
		console.log("selected button is = ", mID);
		let uID = parseInt(req.session.userID);
		console.log("userID = ", uID);
		if(mID === undefined){
			res.status(403).send("You have not selected anything");
			return;
		}
		// User.findOne({ID:uID}).exec(function(err,u){
		// 	console.log("user watched movies = ",u.watchedMovies);
		// 	console.log("Wanted to remove this movie id: ", mID);
		// 	res.status(200);
		// 	res.redirect("/users/"+uID);
		// });
		User.updateOne({ID:uID}, {$pull: {watchedMovies: mID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("err trying to unwatch film");
			}
			console.log("Removed from watched movie list");
			console.log("result:",result);
			res.status(200);
			res.redirect("/users/"+uID);
		});
	}
	//Update recommended movies
	function updateRecommendedMovies(uID){
		User.findOne({ID: uID}).populate('watchedFilms','ID genres').exec(function(err,user){
			if(err){
				console.log("err finding user to update recommended movies");
				return;
			}
			//Add up all genres into one array
			let genres = [];
			user.watchedFilms.forEach(function(m){
				genres = genres.concat(m.genres);
			});

			//Count frequency of genres
			let freqGenres = [];
			let visited = [];
			for(let i = 0; i < genres.length; i++){
				visited.push(false);
			}

			for(let i = 0; i < genres.length; i++){
				if(visited[i] === true){
					continue;
				}
				let count = 1;
				freqGenres.push({Genre: genres[i], freq: 1});
				for(let j = i + 1; j < genres.length; j++){
					if(genres[i] == genres[j]){
						visited[j] = true;
						freqGenres[freqGenres.length-1].freq++;
						count++;
					}
				}
			}

			//Sort genres in descending order in terms of frequency
			freqGenres.sort(function(a,b){
				return b.freq - a.freq;
			});
			//Get most frequent genre
			let mostFrequentGenre = freqGenres[0].Genre;
			//Get movies in that genre
			Movie.find({ID: {$nin: user.watchedMovies}}).where("genres").regex(new RegExp(".*" + mostFrequentGenre + ".*", "i")).select('ID averageRating')
			.exec(function(err2, movies){
				if(err2){
					console.log(err2);
					console.log("Error finding movies to calculate recommended movies");
					return;
				}
				//Sort the movies in terms of average rating
				movies.sort(function(a,b){
					return b.averageRating - a.averageRating;
				});
				//Grab the first 5 top rated if unless length is less than 5
				let recommended = [];
				if(movies.length > 5){
					recommended = [movies[0].ID, movies[1].ID, movies[2].ID, movies[3].ID, movies[4].ID];
				}
				else{
					movies.forEach(function(mov){
						recommended.push(mov.ID);
					});
				}
				//Update users recommended movie list
				User.updateOne({ID: uID}, {$set: {recommendedMovies: recommended}}).exec(function(err3, result){
					if(err3){
						console.log("Error updating users recommended movies, err = ",err3);
						return;
					}
					console.log("Updated recommended movies for user");
				});
			});
		});
	}

	//Create new review (using mongoose)
	function createNewReview(req,res,next){
		//Check database count for reviews
		Review.countDocuments({}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("Error counting reviews.");
				return;
			}
			console.log("Review count = " + result);
			console.log("rating: ",req.body.rating);
			console.log("brief description: ",req.body.briefDescription);
			console.log("full review: ",req.body.fullText);
			let rType = "";
			//Check if Both brief description and full text is filled in - set review type accordingly
			if(req.body.briefDescription.length === 0 || req.body.fullText.length === 0){
				console.log("Missing fulltext and/or brief description --> creating a basic review");
				req.body.briefDescription = "";
				req.body.fullText = "";
				rType = "Basic";
			}
			else{
				console.log("Creating full review");
				rType = "Full";
			}
			
			
			//Find movie title to create review
			Movie.findOne({ID: req.params.id}).exec(function(err2,movie){
				if(err2){
					console.log(err2);
					res.status(500).send("Error finding movie for review.");
					return;
				}
				//Create new review
				let r = new Review({ID: result, movieID: movie.ID , movieTitle: movie.title, rating: req.body.rating,
									summary: req.body.briefDescription, fullReview: req.body.fullText, user: req.session.name,
									userID: req.session.userID, type: rType});
				r.save(function(err3, result3){
					if(err3){
						console.log(err3);
						res.status(500).send("Error creating review.");
						return;
					}
					//Update the movie to include ID of new review that was made and update movie average rating
					updateMovieReviews(req.params.id, result);
					updateMovieAverageRating(req.params.id, result, req.body.rating);
					//Update User to include the review they just made
					updateUserReviews(req.session.userID, result);
					//Send notifications if applicable ***
					sendNewReviewNotification(req.session.userID, req.session.name, result);

					res.status(201);
					res.redirect("/movies/"+req.params.id);
				})	
			});
				
		})
	}
	//Update movie reviews
	function updateMovieReviews(mID, rID){
		Movie.updateOne({ID: mID}, {$push: {reviews: rID}}).exec(function(err,result){
			if(err){
				console.log("error updating movie to include new review, err = ", err);
				return;
			}
			console.log("Updated movie reviews");
		});
	}
	//Update movie average rating
	function updateMovieAverageRating(mID, rID, rating){
		Movie.findOne({ID: mID}).populate('rvws').exec(function(err,movie){
			if(err){
				console.log("error finding movie to update movie rating err = ", err);
				return;
			}
			let total = rating;
			let count = 1;
			movie.rvws.forEach(function(r){
				if(r.ID != rID){
					total = parseInt(total) + parseInt(r.rating);
					count++;
				}
			})
			let avgRating = total/count;
			avgRating = avgRating.toFixed(1);

			Movie.updateOne({ID: movie.ID}, {averageRating: avgRating}).exec(function(err2,result){
				if(err2){
					console.log("error updating movie rating err = ", err);
					return;
				}
				console.log("updated average rating for this movie");
			})
		});
	}
	//Update user reviews
	function updateUserReviews(uID, rID){
		User.updateOne({ID: uID}, {$push: {reviews: rID}}).exec(function(err,result){
			if(err){
				console.log("error updating user to include new review, err = ", err);
				return;
			}
			console.log("Updated user reviews");
		});
	}
	//Send new review notification
	function sendNewReviewNotification(uID,uName,rID){
		User.findOne({ID: uID}).exec(function(err,user){
			if(err){
				console.log("error finding user to send new review notification err = ", err);
				return;
			}
			User.find({ID: {$in: user.followers}}).exec(function(err2,users){
				if(err2){
					console.log("error finding user followers to send review notification, err = ", err2);
					return;
				}
				console.log("Users followers to update",users);
				users.forEach(function(u){
					User.updateOne({ID: u.ID}, {$push: {userNotifications: rID}}).exec(function(err3,result){
						if(err3){
							console.log("error updating users notifications err = ", err3);
							return;
						}
					});
				});
			});
		});
	}


/* PEOPLE RELATED FUNCTIONS */
	//Get People (using mongoose)
	function getPeople(req,res,next){
		// if(req.query.peopleSearch === undefined){
		// 	req.query.peopleSearch = "";
		// }
		let amount = 10;
		let startIndex = ((req.query.page-1) * amount);

		People.find().where("name").regex(new RegExp(".*" + req.query.peopleSearch + ".*", "i"))
		.select('ID name')
		.limit(amount)
		.skip(startIndex)
		.exec(function(err, results){
			if(err){
				res.status(500).send("Error reading movies.");
				console.log(err);
				return;
			}
			console.log("Found " + results.length + " matching people.");
			res.products = results;
			res.render("people", {people: results, qstring: req.qstring, current: req.query.page, session: req.session}); 
			return;
		})
	}

	//Get person (using mongoose)
	function getPerson(req,res,next){
		let isFollowing = false;
		if(req.session.loggedin){
			console.log("User ID exists, checking if following this P");
			User.findOne({ID: req.session.userID}).exec(function(err,user){
				if(err){
					res.status(500).send("Error reading user.");
					console.log(err);
					return;
				}
				console.log("User from session: ", user);
				People.findOne({ID: parseInt(req.params.id)}).populate('prevAW').populate('prevDW')
				.populate('prevWW').populate('freqC')
				.exec(function(err, person){
					if(err){
						res.status(500).send("Error reading person.");
						console.log(err);
						return;
					}
					user.followingPeople.forEach(function(p){
						if(p == req.params.id){
							isFollowing = true;
						}
					});
					res.render("person",{person: person, prevAW: person.prevAW, prevDW: person.prevDW, 
								prevWW: person.prevWW, freqC: person.freqC, isFollowing: isFollowing, session: req.session}); 
					return;
				});
			});
		}
		else{
			People.findOne({ID: parseInt(req.params.id)}).populate('prevAW').populate('prevDW')
			.populate('prevWW').populate('freqC')
			.exec(function(err, person){
				if(err){
					res.status(500).send("Error reading person.");
					console.log(err);
					return;
				}
				res.render("person",{person: person, prevAW: person.prevAW, prevDW: person.prevDW, 
							prevWW: person.prevWW, freqC: person.freqC, isFollowing: isFollowing, session: req.session}); 
				return;
			});
		}
	}

	//Follow new person (mongoose)
	function followNewPerson(req,res,next){
		let sID = req.session.userID;
		let pID = parseInt(req.params.id);
		//Update persons followers
		People.updateOne({ID: pID}, {$push: {followers: sID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error following person");
			}
			//Update session users followingPeople
			updateUFollowingP(sID, pID);
			res.status(200);
			res.redirect("/people/"+req.params.id);
			return;
		});
	}
	//Update users following People (mongoose)
	function updateUFollowingP(uID, pID){
		User.updateOne({ID: uID}, {$push: {followingPeople: pID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error updating users following people list");
				return;
			}
			console.log("Updated Users Following People");
		});
	}

	//Unfollow person (mongoose)
	function unfollowPerson(req,res,next){
		let sID = req.session.userID;
		let pID = parseInt(req.params.id);
		//Update persons followers
		People.updateOne({ID: pID}, {$push: {followers: sID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("err unfollowing person");
			}
			//Update session users followingPeople
			updateUserUnFollowingP(sID, pID);
			res.status(200);
			res.redirect("/people/"+req.params.id);
			return;
		});
	}
	//Update users followingPeople from unfollow click (mongoose)
	function updateUserUnFollowingP(uID, pID){
		User.updateOne({ID: uID}, {$pull: {followingPeople: pID}}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("error updating users followingpeople list as regards to unfollowing");
				return;
			}
			console.log("Updated Users Following People");
		});
	}

	//Create new person (using mongoose)
	function createNewPerson(req,res,next){
		//Check database count for people
		People.countDocuments({}).exec(function(err,result){
			if(err){
				console.log(err);
				res.status(500).send("Error counting people.");
				return;
			}
			console.log("People count = " + result);
			People.findOne().where("name").regex(new RegExp(".*" + req.body.pname + ".*", "i"))
			.exec(function(err2, result2){
				if(err2){
					console.log(err2);
					res.status(500).send("Error finding person with name.");
					return;
				}
				console.log("Result = " + result2);
				if(!result2){
					let p = new People({ID: result, name: req.body.pname, prevDirectingWork: [],
	 				prevWritingWork: [], prevActingWork: [], frequentCollaborators: [], followers:[]});
	 				p.save(function(err3, result3){
						if(err3){
							console.log(err3);
							res.status(500).send("Error creating person.");
							return;
						}
						res.status(201).send("Created new person");
					})

				}
				else{
					res.status(403).send("Person already exists");
				}
			})
			
		})
	}



	//Get Director (mongoose) -for AJAX call when creating movie
	function getDirectors(req,res,next){
		console.log("Body is = " + req.body);
		let amount = 5;

		People.find().where("name").regex(new RegExp(".*" + req.body.directors + ".*", "i"))
		.limit(amount)
		.exec(function(err, results){
			if(err){
				res.status(500).send("Error reading people.");
				console.log(err);
				return;
			}
			console.log("Found " + results.length + " matching people.");
			res.products = results;
			res.status(200).send(results);
			return;
		})
		return;
	}

	//Get Director (mongoose) -for AJAX call when creating movie
	function getWriters(req,res,next){
		console.log("Body is = " + req.body);
		let amount = 5;

		People.find().where("name").regex(new RegExp(".*" + req.body.writers + ".*", "i"))
		.limit(amount)
		.exec(function(err, results){
			if(err){
				res.status(500).send("Error reading people.");
				console.log(err);
				return;
			}
			console.log("Found " + results.length + " matching people.");
			res.products = results;
			res.status(200).send(results);
			return;
		})
		return;
	}

	//Get Director (mongoose) -for AJAX call when creating movie
	function getActors(req,res,next){
		console.log("Body is = " + req.body);
		let amount = 5;

		People.find().where("name").regex(new RegExp(".*" + req.body.actors + ".*", "i"))
		.limit(amount)
		.exec(function(err, results){
			if(err){
				res.status(500).send("Error reading people.");
				console.log(err);
				return;
			}
			console.log("Found " + results.length + " matching people.");
			res.products = results;
			res.status(200).send(results);
			return;
		})
		return;
	}


/* REVIEW RELATED FUNCTIONS */
	//Get review
	function getReview(req,res,next){
		Review.findOne({ID: req.params.rid}).exec(function(err,review){
			if(err){
				console.log(err);
				res.status(500).send("error finding review");
				return;
			}
			res.render("review",{review: review, session: req.session});
		});
	}


/* QUERY PARSER */
	//Movie Query
	function queryParserMovies(req, res, next){
		const MAX_PRODUCTS = 50;
		
		//build a query string to use for pagination later
		let params = [];
		for(prop in req.query){
			if(prop == "page"){
				continue;
			}
			params.push(prop + "=" + req.query[prop]);
		}
		req.qstring = params.join("&");
		
		try{
			req.query.page = req.query.page || 1;
			req.query.page = Number(req.query.page);
			if(req.query.page < 1){
				req.query.page = 1;
			}
		}catch{
			req.query.page = 1;
		}
		
		if(!req.query.titleSearch){
			req.query.titleSearch = "?";
		}
		if(!req.query.genreSearch){
			req.query.genreSearch = "?";
		}	
		if(!req.query.personSearch){
			req.query.personSearch = "?";
		}			
		next();
	}
	//User Query
	function queryParserUsers(req, res, next){
		const MAX_PRODUCTS = 50;
		
		//build a query string to use for pagination later
		let params = [];
		for(prop in req.query){
			if(prop == "page"){
				continue;
			}
			params.push(prop + "=" + req.query[prop]);
		}
		req.qstring = params.join("&");
		
		try{
			req.query.page = req.query.page || 1;
			req.query.page = Number(req.query.page);
			if(req.query.page < 1){
				req.query.page = 1;
			}
		}catch{
			req.query.page = 1;
		}
		
		if(!req.query.nameSearch){
			req.query.nameSearch = "?";
		}		
		next();
	}
	//People Query
	function queryParserPeople(req, res, next){
		const MAX_PRODUCTS = 50;
		
		//build a query string to use for pagination later
		let params = [];
		for(prop in req.query){
			if(prop == "page"){
				continue;
			}
			params.push(prop + "=" + req.query[prop]);
		}
		req.qstring = params.join("&");
		
		try{
			req.query.page = req.query.page || 1;
			req.query.page = Number(req.query.page);
			if(req.query.page < 1){
				req.query.page = 1;
			}
		}catch{
			req.query.page = 1;
		}
		
		if(!req.query.peopleSearch){
			req.query.peopleSearch = "?";
		}		
		next();
	}

mongoose.connect('mongodb://localhost/movieWebDB', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	app.listen(3000);
	console.log("Server listening on port 3000");
});