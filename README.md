# iMovie DB
Movie Web App similar to IMDB implementing a movie web server using NodeJS, Express, and MongoDB hosted on local machine

![logo-1](https://user-images.githubusercontent.com/86802653/125035728-2a887400-e060-11eb-856b-10e1ae00503d.png)



	Author Info:
		-Jason Coil
		-Ade Banjo
	
	Included in this folder:
		-server dependencies (package and package-lock) to setup server
		-the javascript server itself
		-database initialization file
		-Schema's for people, users, movies, and reviews
		-views folder which contains all the pug template along with some partials, css and an img
	
	Folders with Important Contents:
			views directory
			db-initializer.js
			MovieModel.js
			PeopleModel.js
			UserModel.js
			ReviewModel.js
			server.js
			package.JSON
			package-lock.JSON
			README.txt
		views:
			css directory
				-includes css files that the pug files reference
			imgs directory
				-includes 1 img used in homepage
			js directory 
				-includes javascript files used when creating movies and removing notifications
			partials directory
				-includes a header pug file and its css file
			createmovie.pug
			createnewuser.pug
			createperson.pug
			homepage.pug
			loginpage.pug
			movie.pug
			movies.pug
			people.pug
			person.pug
			review.pug
			user.pug
			users.pug
			userverified.pug


	How to initialize database:
		-Extract all files from projectExpress-v1.1 folder into one location
		-Open up command prompt
		-Navigate to /MongoDB/Server/4.4/bin (i.e. wherever you have MongoDB installed go to the bin folder)
		-Type this in command prompt:
			mongod
		-Open up a NodeJS command prompt
		-Navigate to COMP2406Project folder 
		-Install dependencies by typing: 
			npm install
		-Next, type:
			node db-initializer.js

	How to run server:
		-Open up NodeJS command prompt
		-Navigate to folder containing all the files you downloaded from the COMP2406Project folder
		-Type in:
			node server.js
		-Open up web browser and go to 'localhost:3000'






	
