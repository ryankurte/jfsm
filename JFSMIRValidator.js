//JSON Finite State Machine Intermediate Representation Validator
//Checks JFSMIR files for validity

var models = ["mixed", "mealy", "moore"];

//Validates a JFSIM input state machine
exports.validate = function(source, callback) {
  //Convert to javascript object
  var stateMachine = json.parse(source);
  
  //Check name exists
  if(typeof stateMachine.name === 'undefined') {
    callback(stateMachine, "State machine name must be specified");
    return;
  }
  
  //Check model exists
  if(typeof stateMachine.model === 'undefined') {
    callback(stateMachine, "State machine model must be specified");
    return;
  }
  
  //Check model is correct
  if(models.indexOf(stateMachine.model) == -1) {
    callback(stateMachine, "Invalid model, options are: mixed, mealy, moore");
    return;
  }
  
  var model = stateMachine.model;
  
  //Check initial state exists
  if(typeof stateMachine.initialState === 'undefined') {
    callback(stateMachine, "State machine initial state must be specified");
    return;
  }
  
  //Check initial is correct
  if(stateMachine.states.indexOf(stateMachine.initialState) == -1) {
    callback(stateMachine, "State machine initial state " + stateMachine.initialState + " does not exist");
    return;
  }
  
  //Check queue length exists
  if(typeof stateMachine.queueLength === 'undefined') {
    callback(stateMachine, "State machine queue length must be specified");
    return;
  }
  
  //Check queue length is a number
  var queueLength = parseInt(stateMachine.queueLength);
  if(queueLength == NaN) {
    callback(stateMachine, "State machine queue length invalid");
    return;
  }
  
  //Parse events
  for(var i=0; i<stateMachine.events.length; i++) {
    //Check events are named
    if(typeof stateMachine.events[i].name === 'undefined') {
      callback(stateMachine, "Event name must be specified");
      return;
    }
  }
  
  //Parse states
  for(var i=0; i<stateMachine.states.length; i++) {
    //Check states are named
    if(typeof stateMachine.states[i].name === 'undefined') {
      callback(stateMachine, "State name must be specified");
      return;
    }
    //Check state outputs are valid
    if(model == "mealy") {
      //Not allowed in mealy model
      if(typeof stateMachine.states[i].output !== 'undefined') {
        callback(stateMachine, "State outputs not allowed in strict Mealy model");
        return;
      }
    } else {
      //Check output event exists
      if(typeof stateMachine.states[i].output !== 'undefined') {
        if(stateMachine.events.indexOf(stateMachine.states[i].output) == -1) {
         callback(stateMachine, "State " + stateMachine.states[i].name + " invalid output event " + stateMachine.states[i].output);
         return;
        }
      }
    }
  }
  
  //Parse transitions
  for(var i=0; i<stateMachine.transitions.length; i++) {
    //Check transitions are named
    if(typeof stateMachine.transitions[i].name === 'undefined') {
      callback(stateMachine, "Transition name must be specified");
      return;
    }
    
    //Check from state is named
    if(typeof stateMachine.transitions[i].from === 'undefined') {
      callback(stateMachine, "Transition " + stateMachine.transitions[i].name + " from name must be specified");
      return;
    }
    
    //Check from state exists
    if(stateMachine.states.indexOf(stateMachine.transitions[i].from) == -1) {
      callback(stateMachine, "Transition " + stateMachine.transitions[i].name + " from state" + stateMachine.transitions[i].from + " does not exist");
      return;
    }
    
    //Check to state is named
    if(typeof stateMachine.transitions[i].to === 'undefined') {
      callback(stateMachine, "Transition" + stateMachine.transitions[i].name + "  to name must be specified");
      return;
    }
    
    //Check to state exists
    if(stateMachine.states.indexOf(stateMachine.transitions[i].to) == -1) {
      callback(stateMachine, "Transition" + stateMachine.transitions[i].name + "  to state " + stateMachine.transitions[i].to + " does not exist");
      return;
    }
    
    //Check trigger is named
    if(typeof stateMachine.transitions[i].trigger === 'undefined') {
      callback(stateMachine, "Transition " + stateMachine.transitions[i].name + " trigger name must be specified");
      return;
    }
    
    //Check trigger exists
    if(stateMachine.events.indexOf(stateMachine.transitions[i].trigger) == -1) {
      callback(stateMachine, "Transition " + stateMachine.transitions[i].name + " trigger event " + stateMachine.transitions[i].trigger + " does not exist");
      return;
    }
    
    //Check state outputs are valid
    if(model == "moore") {
      //Output events not allowed in moore model
      if(typeof stateMachine.transitions[i].output !== 'undefined') {
        callback(stateMachine, "Transition " + stateMachine.transitions[i].name + " outputs not allowed in strict Moore model");
        return;
      }
    
    } else {
      //If there is an output event
      if(typeof stateMachine.transitions[i].output !== 'undefined') {
        //Check it exists
        if(stateMachine.events.indexOf(stateMachine.states[i].output) == -1) {
         callback(stateMachine, "Transition " + stateMachine.transitions[i].name + " invalid output event " + stateMachine.states[i].output);
         return;
        }
      }
    }
  }

  //Call callback with no error argument
  callback(stateMachine, null);
}