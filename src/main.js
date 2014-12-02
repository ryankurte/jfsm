
var fs = require('fs');
var minimist = require('minimist');

var validator = require('./FSMValidator');
var executor = require('./FSMExecutor');
var generator = require('./FSMGenerator');

//Load file
var stateMachineSource = fs.readFileSync(process.argv[2]);

//Convert to javascript object
var stateMachine = JSON.parse(stateMachineSource);

//Validate state machine
var valid = validator.validate(stateMachine);

if(valid != null) {
	console.log("Error: invalid JSON FSM syntax");
	return -1;
}

//Generate state machine code
generator.generateSource("c", "./outputs", stateMachine);

return 0;
