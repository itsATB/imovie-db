let movie = {genres:[],
			directors:[],
			writers:[],
			actors:[]};

//Make a post request to create a movie
function createMovie(){
	movie.averageRating = 0;
	movie.title = document.getElementById("title").value;
	movie.releaseYear = document.getElementById("rYear").value;
	movie.runtime = document.getElementById("runtime").value;
	movie.plot = document.getElementById("plot").value;

	//Checking for unexpected input of non number values for release year and runtime
	if(isNaN(movie.releaseYear)){
		alert("error - release year is not a number");
		return;
	}
	if(isNaN(movie.runtime)){
		alert("error - runtime is not a number");
		return;
	}

	//get genre array by splitting at the comma
	genresArray = document.getElementById("genres").value.split(",");
	movie.genres = genresArray;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==201){
			alert("movie created");
		}
		if(this.readyState==4 && this.status==403){
			alert("error - forms elements missing");
		}
		if(this.readyState==4 && this.status==401){
			alert("error - not logged in or not a contributing user");

		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/createmovie`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(movie));
}

//Add director to movie
function addDirector(){

	let m = {directors: []};
	m.directors = document.getElementById("directors").value;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200){
			let result = JSON.parse(this.responseText);
			console.log(result);
			let string = "";
			result.forEach(function(p){
				let name = p.name.split(" ");
				let n = "";
				if(name[1] === undefined){
					n = name[0]+"_err";
				}
				else{ 
					n = name[0] + "_" + name[1];
				}
				string = string + p.name + "<button type='button' id='addD' onclick='addD(this)' name ="+n+">" + "Add " + p.name  + "</button>" + "<br></br>";
			});
			
			document.getElementById("directorsP").innerHTML = string;
			
		}
		if(this.readyState==4 && this.status==500){
			alert("error - can't find people");
		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/getDirectors`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(m));
}

function addD(obj){
	let buttonVal = obj;
	console.log("BUTTON NAME = " + buttonVal.name);
	let name = buttonVal.name.split("_");
	let n = "";
	if(name[1] === "err"){
		n = name[0];
	}
	else{
		n = name[0] + " " + name[1];
	}
	console.log("Director Name = " + n);
	movie.directors.push(n);
	console.log("added directors = " + movie.directors);
	document.getElementById("addedDirectors").innerHTML = movie.directors;
	document.getElementById("directorsP").innerHTML = "";
}

//Add director to movie
function addWriter(){

	let m = {writers: []};
	m.writers = document.getElementById("writers").value;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200){
			let result = JSON.parse(this.responseText);
			console.log(result);
			let string = "";
			result.forEach(function(p){
				let name = p.name.split(" ");
				let n = "";
				if(name[1] === undefined){
					n = name[0]+"_err";
				}
				else{ 
					n = name[0] + "_" + name[1];
				}
				string = string + p.name + "<button type='button' id='addD' onclick='addW(this)' name ="+n+">" + "Add " + p.name  + "</button>" + "<br></br>";
			});
			
			document.getElementById("writersP").innerHTML = string;
			
		}
		if(this.readyState==4 && this.status==500){
			alert("error - can't find people");
		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/getWriters`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(m));
}

function addW(obj){
	let buttonVal = obj;
	console.log("BUTTON NAME = " + buttonVal.name);
	let name = buttonVal.name.split("_");
	let n = "";
	if(name[1] === "err"){
		n = name[0];
	}
	else{
		n = name[0] + " " + name[1];
	}
	console.log("Writer Name = " + n);
	movie.writers.push(n);
	console.log("added directors = " + movie.writers);
	document.getElementById("addedWriters").innerHTML = movie.writers;
	document.getElementById("writersP").innerHTML = "";
}

//Add director to movie
function addActor(){

	let m = {actors: []};
	m.actors = document.getElementById("actors").value;
	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200){
			let result = JSON.parse(this.responseText);
			console.log(result);
			let string = "";
			result.forEach(function(p){
				let name = p.name.split(" ");
				let n = "";
				if(name[1] === undefined){
					n = name[0]+"_err";
				}
				else{ 
					n = name[0] + "_" + name[1];
				}
				string = string + p.name + "<button type='button' id='addD' onclick='addA(this)' name ="+n+">" + "Add " + p.name  + "</button>" + "<br></br>";
			});
			
			document.getElementById("actorsP").innerHTML = string;
			
		}
		if(this.readyState==4 && this.status==500){
			alert("error - can't find people");
		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/getActors`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(m));
}

function addA(obj){
	let buttonVal = obj;
	console.log("BUTTON NAME = " + buttonVal.name);
	let name = buttonVal.name.split("_");
	let n = "";
	if(name[1] === "err"){
		n = name[0];
	}
	else{
		n = name[0] + " " + name[1];
	}
	console.log("Actor Name = " + n);
	movie.actors.push(n);
	console.log("added actors = " + movie.actors);
	document.getElementById("addedActors").innerHTML = movie.actors;
	document.getElementById("actorsP").innerHTML = "";
}