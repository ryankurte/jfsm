#!/usr/bin/env node

var fs = require('fs');
var minimist = require('minimist');

var validator = require('./fsm-validator.js');
var executor = require('./fsm-executor.js');
var generator = require('./fsm-generator.js');

var args = minimist(process.argv.slice(2));

console.log('Running from: ' + process.env.PWD);

//Parse command line arguments
//TODO: Switch to commander module with proper help messages
if(!args.file) {
	console.log("File name must be specified with --file=fileName");
	return 0;
}

if(!args.lang) {
	console.log("Output language must be specified with --lang=languageName");
	return 0;
}

//Load file
var stateMachineSource = fs.readFileSync(args.file);

//Convert to javascript object
var stateMachine = JSON.parse(stateMachineSource);

if(args.prettyprint) {
	//Write back pretty printed version
	var prettyPrinted = JSON.stringify(stateMachine, null, 2);
	fs.writeFileSync(args.file, prettyPrinted);
}

//Validate state machine
var valid = validator.validate(stateMachine);

if(valid != null) {
	console.log("Error: invalid JSON FSM syntax");
	return -1;
}

//Generate state machine code
generator.generateSource(args.lang, "./outputs", stateMachine);

return 0;
