
var fs = require('fs');
var minimist = require('minimist');

var validator = require('./FSMValidator');
var executor = require('./FSMExecutor');
var generator = require('./FSMGenerator');

console.log("Main");

//Load file
var stateMachineSource = fs.readFileSync(process.argv[2]);

//Validate state machine
var stateMachine = validator.validate(stateMachineSource);

//Generate state machine code
//TODO: C generation requires explicit mealy or moore state machine
var stateMachineImplSource = generator.generateCSource(stateMachine);
var stateMachineImplHeader = generator.generateCHeader(stateMachine);

fs.writeFileSync('a.c', stateMachineImplSource);
fs.writeFileSync('a.h', stateMachineImplHeader);

