
var fs = require('fs');
var minimist = require('minimist');

var validator = require('./fsm-validator');
var executor = require('./fsm-executor');
var generator = require('./fsm-generator');

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
generator.generateSource("csharp", "./outputs", stateMachine);

return 0;
