//Title, Year, Runtime, Genre, Director, Writer, Actors, Plot
//movieDB = JSON.parse(movieDB);

let users = [{ID: 0, name:"Jim",password:"1234",userType:"Regular",
		followingPeople:[0,1], followingUsers:[1],
	 	followers:[],watchedMovies:[2],
	 	recommendedMovies:[1],reviews:[1],
	 	userNotifications:[2], peopleNotifications:["Andy Samberg was involved in a new movie: Hot Rod*2"]},
		{ID: 1, name:"Bob",password:"911",userType:"Regular",
		followingPeople:[1], followingUsers:[],
	 	followers:[0],watchedMovies:[2],
	 	recommendedMovies:[1],reviews:[0,2],
	 	notifications:[]},
	 	{ID: 2, name:"Bobby",password:"hello",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 3, name:"Molly",password:"juice",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[2],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 4, name:"Sol98",password:"655",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[1],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 5, name:"Pete",password:"001",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[3],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 6, name:"Linda",password:"soup",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[9],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 7, name:"Louise",password:"carrot",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[6],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 8, name:"Teddy",password:"lettuce",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[7,10],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 9, name:"Tina",password:"tomato",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[12],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 10, name:"Gene",password:"bean",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[10],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 11, name:"Mort",password:"chickpea",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[11],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 12, name:"Pat",password:"cucumber",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[5],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 13, name:"Bilbo",password:"celery",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[8,11,3],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]},
	 	{ID: 14, name:"Sauron",password:"banana",userType:"Regular",followingPeople:[], followingUsers:[],followers:[],watchedMovies:[4],recommendedMovies:[],reviews:[],userNotifications:[], peopleNotifications:[]}
		];

let numUsers = 15;

let reviews = [{ID:0,movieID:1, movieTitle: "Busses", rating:8,
		summary:"", fullReview:"",user:"Bob",userID: 1,type:"Basic"},
	 	{ID:1,movieID:2, movieTitle: "Hot Rod",rating:10,
		summary:"Amazing, you should watch this!", fullReview:"Amazing, you should"+
		" watch this! It was enjoyable all the way through. Lots of laughs. Wow.",
	 	user:"Jim",userID: 0,type:"Full"},
	 	{ID:2,movieID:2, movieTitle: "Hot Rod", rating:7,
		summary:"", fullReview:"",
	 	user:"Bob",userID: 1,type:"Basic"}
		];
let numReviews = 3;

let movies = [{ID: 0,averageRating:0,title:"The Great Game",releaseYear:"1813",
		runtime:49406400, plot:"Political and diplomatic confrontation between" +
		" the British and the Russians over Afghanistan territory.", 
		genres:["Political","Action","Mystery","Drama"], directors:[1],writers:[2],
	 	actors:[1, 2,3], reviews: []},
	 	{ID: 1,averageRating:8,title:"Busses",releaseYear:"2005",
		runtime:96, plot:"Documentary on Busses", 
		genres:["Documentary","Action"],
	 	directors:[0],writers:[0],
	 	actors:[2,4], reviews: [0]},
	 	{ID: 2,averageRating:8.5,title:"Hot Rod",releaseYear:"2013",
		runtime:96, plot:"Rod Jumps Busses to Raise Money for" +
		" Step-Dad's Heart Surgery.", genres:["Comedy","Romance","HeartFelt"],
	 	directors:[1],writers:[2],
	 	actors:[0,1, 2,3], reviews: [1,2]},
	    {ID: 3,averageRating:0,title:"Dumb and Dumber",releaseYear:"2013",runtime:96, plot:"2 dummies", genres:["Comedy"],directors:[3],writers:[4],actors:[4,11], reviews: []},
	    {ID: 4,averageRating:0,title:"Charlotte's Web",releaseYear:"2011",runtime:100, plot:"spider", genres:["Drama"],directors:[4],writers:[8],actors:[3], reviews: []},
	    {ID: 5,averageRating:0,title:"Casino Royale",releaseYear:"2013",runtime:87, plot:"poker", genres:["Action"],directors:[7],writers:[6],actors:[12], reviews: []},
	    {ID: 6,averageRating:0,title:"Hot Tub Time Machine",releaseYear:"2013",runtime:97, plot:"hot tub travel", genres:["Comedy"],directors:[13],writers:[6],actors:[13], reviews: []},
	    {ID: 7,averageRating:0,title:"Jungle",releaseYear:"2013",runtime:93, plot:"lost->survive", genres:["Thriller"],directors:[5],writers:[8],actors:[7], reviews: []},
	    {ID: 8,averageRating:0,title:"Orphan",releaseYear:"2013",runtime:110, plot:"scary girl", genres:["Horror"],directors:[11],writers:[4],actors:[8], reviews: []},
	    {ID: 9,averageRating:0,title:"50 First Dates",releaseYear:"2013",runtime:123, plot:"hit head, no remember", genres:["Comedy","Romance"],directors:[6],writers:[10],actors:[8], reviews: []},
	    {ID: 10,averageRating:0,title:"Semi Pro",releaseYear:"2013",runtime:105, plot:"bball pro", genres:["Comedy"],directors:[12],writers:[12],actors:[9], reviews: []},
	    {ID: 11,averageRating:0,title:"Hot Fuzz",releaseYear:"2013",runtime:89, plot:"secret cult", genres:["Action","Comedy"],directors:[10],writers:[3],actors:[13], reviews: []},
	    {ID: 12,averageRating:0,title:"Shaun of the Dead",releaseYear:"2013",runtime:102, plot:"zombie slam", genres:["Comedy"],directors:[11],writers:[9],actors:[13], reviews: []},
	    {ID: 13,averageRating:0,title:"Elf",releaseYear:"2013",runtime:94, plot:"xmas spaghetti", genres:["Comedy","HeartFelt"],directors:[7],writers:[3],actors:[13], reviews: []},
	    {ID: 14,averageRating:0,title:"Love Letter",releaseYear:"2013",runtime:95, plot:"love fails", genres:["Drama","Romance"],directors:[1],writers:[9],actors:[9], reviews: []},
	    {ID: 15,averageRating:0,title:"Dunkaroos",releaseYear:"2013",runtime:90, plot:"icy treat", genres:["Comedy"],directors:[7],writers:[11],actors:[5], reviews: []}
		];

let numMovies = 16;

let people = [{ID: 0,name:"Tim Burr",prevDirectingWork:[1],
		prevWritingWork:[1],prevActingWork:[2],
		frequentCollaborators:[2], followers: [0]},
		{ID: 1,name:"Andy Samberg",prevDirectingWork:[0,1,2],
		prevWritingWork:[1],prevActingWork:[0,1,2],
		frequentCollaborators:[2], followers:[0,1]},
		{ID: 2,name:"Fish Lagoon",prevDirectingWork:[0],
		prevWritingWork:[0,1],prevActingWork:[0,2],
		frequentCollaborators:[1], followers: []},
		{ID: 3,name:"Daniel Craig",prevDirectingWork:[3],prevWritingWork:[11,13],prevActingWork:[0,2,4],frequentCollaborators:[4], followers: []},
		{ID: 4,name:"Levar Burton",prevDirectingWork:[4],prevWritingWork:[3,8],prevActingWork:[3,1],frequentCollaborators:[3], followers: []},
		{ID: 5,name:"Daniel Radcliffe",prevDirectingWork:[7],prevWritingWork:[],prevActingWork:[15],frequentCollaborators:[6], followers: []},
		{ID: 6,name:"Julia Roberts",prevDirectingWork:[9],prevWritingWork:[5,6],prevActingWork:[],frequentCollaborators:[5], followers: []},
		{ID: 7,name:"Jeff Bridges",prevDirectingWork:[5,13,15],prevWritingWork:[],prevActingWork:[7],frequentCollaborators:[8], followers: []},
		{ID: 8,name:"Trisha Coller",prevDirectingWork:[],prevWritingWork:[4,7],prevActingWork:[8,9],frequentCollaborators:[7], followers: []},
		{ID: 9,name:"Polly Rogers",prevDirectingWork:[],prevWritingWork:[12,14],prevActingWork:[10,14],frequentCollaborators:[10], followers: []},
		{ID: 10,name:"Kevin Mallone",prevDirectingWork:[11],prevWritingWork:[9],prevActingWork:[],frequentCollaborators:[9], followers: []},
		{ID: 11,name:"Steve Carell",prevDirectingWork:[12,8],prevWritingWork:[15],prevActingWork:[3],frequentCollaborators:[12], followers: []},
		{ID: 12,name:"Will Ferrell",prevDirectingWork:[10],prevWritingWork:[10],prevActingWork:[5],frequentCollaborators:[11,13], followers: []},
		{ID: 13,name:"Veronica Mars",prevDirectingWork:[6],prevWritingWork:[],prevActingWork:[6,11,12,13],frequentCollaborators:[12], followers: []}
		];

let numPeople = 14;

//Title, Year, Runtime, Genre, Director, Writer, Actors, Plot

//Update movies array and people array
//For each movie --> extract info you need -> create movie object -> push onto movies
//Extract directors --> Check if person exists or not already -> create people with those names (if not added already) then add onto their directing history
//Extract writers --> Check if person exists or not already -> create people with those names (if not added already) then add onto their writing history
//Extract actors --> Check if person exists or not already -> create people with those names (if not added already) then add onto their acting history
movieDB.forEach(function(movie){
	let m = {ID: numMovies,averageRating: 0,title:movie.Title,releaseYear: movie.Year,
		runtime: 0, plot: movie.Plot, 
		genres: movie.Genre, directors:[],writers:[],
	 	actors:[], reviews: []}
	 	//Get runtime
	 	let rt = movie.Runtime;
	 	rt = rt.split(" min");
	 	let runT = parseInt(rt[0]);
	 	m.runtime = runT;
	 	//Get directors
	 	let directors = movie.Director;
	 	directors.forEach(function(d){
	 		let directorExists = false;
	 		for(let i = 0; i < numPeople; i++){
	 			if(d == people[i].name){
	 				//Director exists --> push onto movie, push onto prevDirectingWork and raise a flag
	 				directorExists = true;
	 				m.directors.push(people[i].ID);
	 				people[i].prevDirectingWork.push(m.ID);
	 				break;
	 			}
	 		}
	 		if(!directorExists){
	 			//Create a new person and add to people and add to movie
	 			p = {ID: numPeople,name: d,prevDirectingWork:[m.ID],
					prevWritingWork:[],prevActingWork:[],
					frequentCollaborators:[], followers: []};
				people.push(p);
				m.directors.push(p.ID);
	 			numPeople++;
	 		}
	 	});

	 	//Get writers
	 	let writers = movie.Writer;
	 	writers.forEach(function(w){
	 		let writerExists = false;
	 		for(let i = 0; i < numPeople; i++){
	 			if(w == people[i].name){
	 				//Director exists --> push onto movie, push onto prevDirectingWork and raise a flag
	 				writerExists = true;
	 				m.writers.push(people[i].ID);
	 				people[i].prevWritingWork.push(m.ID);
	 				break;
	 			}
	 		}
	 		if(!writerExists){
	 			//Create a new person and add to people and add to movie
	 			p = {ID: numPeople,name: w,prevDirectingWork:[],
					prevWritingWork:[m.ID],prevActingWork:[],
					frequentCollaborators:[], followers: []};
				people.push(p);
				m.writers.push(p.ID);
	 			numPeople++;
	 		}
	 	});

	 	//Get actors
	 	let actors = movie.Actors;
	 	actors.forEach(function(a){
	 		let actorExists = false;
	 		for(let i = 0; i < numPeople; i++){
	 			if(a == people[i].name){
	 				//Director exists --> push onto movie, push onto prevDirectingWork and raise a flag
	 				actorExists = true;
	 				m.actors.push(people[i].ID);
	 				people[i].prevActingWork.push(m.ID);
	 				break;
	 			}
	 		}
	 		if(!actorExists){
	 			//Create a new person and add to people and add to movie
	 			p = {ID: numPeople,name: a,prevDirectingWork:[],
					prevWritingWork:[],prevActingWork:[m.ID],
					frequentCollaborators:[], followers: []};
				people.push(p);
				m.actors.push(p.ID);
	 			numPeople++;
	 		}
	 	});

	 	movies.push(m);
	 	numMovies++;
});	


//Calculate frequent collaborators
//For each person --> get all movies and add each person that participated in all those movies into a big array
//Calculate the frequency of each person
people.forEach(function(person){
	let peopleInSameMovie = [];
	//Add prev directing work people into array
	person.prevDirectingWork.forEach(function(md){
		movies[md].directors.forEach(function(d){
			if(person.ID != d){
				peopleInSameMovie.push(d);
			}
		});
		movies[md].writers.forEach(function(w){
			if(person.ID != w){
				peopleInSameMovie.push(w);
			}
		});
		movies[md].actors.forEach(function(a){
			if(person.ID != a){
				peopleInSameMovie.push(a);
			}
		});
	});
	//Add prev writing work people into array
	person.prevWritingWork.forEach(function(mw){
		movies[mw].directors.forEach(function(d2){
			if(person.ID != d2){
				peopleInSameMovie.push(d2);
			}
		});
		movies[mw].writers.forEach(function(w2){
			if(person.ID != w2){
				peopleInSameMovie.push(w2);
			}
		});
		movies[mw].actors.forEach(function(a2){
			if(person.ID != a2){
				peopleInSameMovie.push(a2);
			}
		});
	});
	//Add prev acting work people into array
	person.prevActingWork.forEach(function(ma){
		movies[ma].directors.forEach(function(d3){
			if(person.ID != d3){
				peopleInSameMovie.push(d3);
			}
		});
		movies[ma].writers.forEach(function(w3){
			if(person.ID != w3){
				peopleInSameMovie.push(w3);
			}
		});
		movies[ma].actors.forEach(function(a3){
			if(person.ID != a3){
				peopleInSameMovie.push(a3);
			}
		});
	});


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
	person.frequentCollaborators = freqCollabsIDs;
});




let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;

  db = client.db('movieWebDB');
  db.dropCollection("users", function(err, result){
		if(err){
			console.log("Error dropping collection. Likely case: collection did not exist");
		}else{
			console.log("Cleared users collection.");
		}

		db.collection("users").insertMany(users, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " users.");
			
		})
  });
  db.dropCollection("movies", function(err, result){
	  if(err){
			console.log("Error dropping collection. Likely case: collection did not exist");
		}else{
				console.log("Cleared movies collection.");
		}

		db.collection("movies").insertMany(movies, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " movies.");
			
		})
  });
  db.dropCollection("people", function(err, result){
	  if(err){
			console.log("Error dropping collection. Likely case: collection did not exist");
		}else{
				console.log("Cleared people collection.");
		}

		db.collection("people").insertMany(people, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " people.");
			
		})
  });
  db.dropCollection("reviews", function(err, result){
	  if(err){
			console.log("Error dropping collection. Likely case: collection did not exist");
		}else{
				console.log("Cleared reviews collection.");
		}

		db.collection("reviews").insertMany(reviews, function(err, result){
			if(err) throw err;
			console.log("Successfuly inserted " + result.insertedCount + " reviews.");
			
		})
  });
});