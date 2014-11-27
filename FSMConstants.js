 //FSM Constants

exports.version = '0.0.1';

//FSM Execution Models
exports.models = ["mealy", "moore", "mixed", "extended", "uml"];

//Additional transition triggers
exports.triggers = ["true", "false"];

//Event types
exports.events = ["input", "output", "internal"];

//Allowed keys in state objects
exports.stateKeys = ["name", "model", "output", "onEntry", "onTick", "onExit", "comment"];

//Allowed keys in transition objects
exports.transitionKeys = ["name", "from", "to", "trigger", "output", "onTransition", "comment"];