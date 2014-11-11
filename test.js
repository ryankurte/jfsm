
var assert = require('assert');
var validator = require('./FSMValidator');
var fs = require('fs');

var mealyExampleFile = __dirname + "/examples/MealyStateMachine.json"
var mooreExampleFile = __dirname + "/examples/MooreStateMachine.json"

var mealySource = fs.readFileSync(mealyExampleFile);
var mooreSource = fs.readFileSync(mooreExampleFile);

validator.validate(mealySource, function(stateMachine, err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Mealy Success!");
	}
});

validator.validate(mooreSource, function(stateMachine, err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Moore Success!");
	}
});

