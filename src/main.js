
var fs = require('fs');
var minimist = require('minimist');

var validator = require('./FSMValidator');
var executor = require('./FSMExecutor');
var generator = require('./FSMGenerator');

console.log("Main");

//Load file
var stateMachineSource = fs.readFileSync(process.argv[2]);

//Convert to javascript object
var stateMachine = JSON.parse(source);

//Validate state machine
var valid = validator.validate(stateMachine);

if(valid != null) {
	return -1;
}

//Generate state machine code
generator.generateSource("c", "./outputs", stateMachine);

return 0;