
var fs = require('fs');
var minimist = require('minimist');

var validator = require('./fsm-validator');
var executor = require('./fsm-executor');
var generator = require('./fsm-generator');

var args = minimist(process.argv.slice(2));

//Parse command line arguments

if(typeof args.file === 'undefined') {
	console.log("File name must be specified with --file=fileName");
	return 0;
}

if(typeof args.lang === 'undefined') {
	console.log("Output language must be specified with --lang=languageName");
	return 0;
}

//Load file
var stateMachineSource = fs.readFileSync(args.file);

//Convert to javascript object
var stateMachine = JSON.parse(stateMachineSource);

//Validate state machine
var valid = validator.validate(stateMachine);

if(valid != null) {
	console.log("Error: invalid JSON FSM syntax");
	return -1;
}

//Generate state machine code
generator.generateSource(args.lang, "./outputs", stateMachine);

return 0;
