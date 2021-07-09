
//Remove User Notification
function removeUNotification(nID, uID){
	let notif = {n: nID};

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200){
			console.log("notification ID = " + nID);
			n = document.getElementById("un_"+nID).innerHTML;
			console.log("Div value = ", n);
			document.getElementById("un_"+nID).innerHTML = "";
		}
		if(this.readyState==4 && this.status==500){
			alert("error - couldnt remove notification");
		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/users/`+uID+"/removedUNotifications");
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(notif));
}

//Remove Person Notification
function removePNotification(nString, uID, mID){
	let string = nString + "*"+mID;
	let notif = {n: string};

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200){
			//console.log("notification ID = " + nID);
			n = document.getElementById("pn_"+nString).innerHTML;
			console.log("Div value = ", n);
			document.getElementById("pn_"+nString).innerHTML = "";
		}
		if(this.readyState==4 && this.status==500){
			alert("error - couldnt remove notification");
		}
	}
	
	//Send a POST request to the server containing the recipe data
	req.open("POST", `/users/`+uID+"/removedPNotifications");
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(notif));
}