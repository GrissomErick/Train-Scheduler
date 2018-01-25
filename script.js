// Initialize Firebase
var config = {
    apiKey: "AIzaSyAUAvpKEZamkmw8nbjXQhSvBAI7iIqp6Ac",
    authDomain: "trains-45490.firebaseapp.com",
    databaseURL: "https://trains-45490.firebaseio.com",
    projectId: "trains-45490",
    storageBucket: "trains-45490.appspot.com",
    messagingSenderId: "386363508808"
  };

firebase.initializeApp(config);

var database = firebase.database();

//Button to add trains
$("#train-btn").on("click", function(event){
	event.preventDefault();

	//grab user inputs
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrainTime = $("#first-train-input").val();
	var frequency = $("#frequency-input").val().trim();
	frequency = parseInt(frequency);

	//Convert time
	var timeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
	//console.log("Time converted: " + timeConverted);

	var diffInTime = moment.duration(moment().diff(moment(firstTrainTime, "HH:mm")), 'milliseconds').asMinutes();
	//console.log("Difference in time: " + diffInTime);

	var timeRemaining = frequency - (Math.floor(diffInTime) % frequency);
	//console.log(timeRemaining);

	var nextTrain = moment(diffInTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(firstTrainTime, "HH:mm")).format("HH:mm");
  	//console.log("Arrival time: " + nextTrain);

  	var minTilTrain = Math.ceil(moment.duration(moment(diffInTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(firstTrainTime, "HH:mm")).diff(moment()), 'milliseconds').asMinutes());
  	//console.log("MINUTES TILL TRAIN: " + minTilTrain); 

	//create local 'temporary' object for holding train data
	var newTrain = {
		name: trainName,
		destination: destination,
		startTime: firstTrainTime,
		frequency: frequency,
		nextTrain: nextTrain,
		minTilTrain: minTilTrain,
	};

	//upload train data to firebase database
	database.ref().push(newTrain);

	//console log everything
	//console.log(newTrain.name);
	//console.log(newTrain.destination);
	//console.log(newTrain.startTime);
	//console.log(newTrain.frequency);
	//console.log(newTrain.nextTrain);
	//console.log(newTrain.minTilTrain);

	//alert successful add
	alert("Train added to schedule!");

	//clear text boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-input").val("");
	$("#frequency-input").val("");

});

//Firebase event for adding train to database, manipulate html to add new row for train entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){
	//console.log(childSnapshot.val());

	//store to variable
	var nameTrain = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var trainStart = childSnapshot.val().startTime;
	var trainFrequency = childSnapshot.val().frequency;
	var arrivalTrain = childSnapshot.val().nextTrain;
	var minTrain = childSnapshot.val().minTilTrain;


	//train info
	//console.log(nameTrain);
	//console.log(trainDestination);
	//console.log("First train: " + trainStart);
	//console.log("Every " + trainFrequency + " min");
	//console.log("Next arrival time: " + arrivalTrain);
	//console.log("Minutes to next arrival: " + minTrain + " min");

	//add each train info to table
	$("#train-table > tbody").append("<tr><td>" + 
	nameTrain + "</td><td>" + 
	trainDestination + "</td><td>" + 
	trainStart + "</td><td>" +
	trainFrequency + "</td><td>" +
	arrivalTrain + "</td><td>" +
	minTrain + "</td></td>"); //+ "</td><td>" + nextTrain + "</td><td>" + minTilTrain + "</td><td>");

});

















