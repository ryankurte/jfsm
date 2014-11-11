//JSON Finite State Machine Intermediate Representation Validator
//Checks JFSMIR files for validity

var models = ["mixed", "mealy", "moore"];
var triggers = ["true", "false"];
var events = ["input", "output", "internal"];

//Validates a JFSIM input state machine
exports.validate = function(source, callback) {
  //Convert to javascript object
  var stateMachine = JSON.parse(source);
  
  //Check name exists
  if(typeof stateMachine.name === 'undefined') {
    callback(null, "State machine name must be specified");
    return;
  }
  
  //Check model exists
  if(typeof stateMachine.model === 'undefined') {
    callback(null, "State machine model must be specified");
    return;
  }
  
  //Check model is correct
  if(!arrayContains(models, stateMachine.model) == -1) {
    callback(null, "Invalid model, options are: mixed, mealy, moore");
    return;
  }
  
  var model = stateMachine.model;
  
  //Check initial state exists
  if(typeof stateMachine.initialState === 'undefined') {
    callback(null, "State machine initial state must be specified");
    return;
  }
  
  //Check initial is correct
  if(!containsName(stateMachine.states, stateMachine.initialState)) {
    callback(null, "State machine initial state " + stateMachine.initialState + " does not exist");
    return;
  }
  
  //Check queue length exists
  if(typeof stateMachine.queueLength === 'undefined') {
    callback(null, "State machine queue length must be specified");
    return;
  }
  
  //Check queue length is a number
  var queueLength = parseInt(stateMachine.queueLength);
  if(queueLength == NaN) {
    callback(null, "State machine queue length invalid");
    return;
  }
  
  //Parse events
  for(var i=0; i<stateMachine.events.length; i++) {
    //Check events are named
    if(typeof stateMachine.events[i].name === 'undefined') {
      callback(null, "Event name must be specified");
      return;
    }
    //Check event types exist
    if(typeof stateMachine.events[i].type === 'undefined') {
      callback(null, "Event type must be specified");
      return;
    }
    //Check event types are valid
    if(!arrayContains(events, stateMachine.events[i].type)) {
      callback(null, "Event name must be specified");
      return;
    }
  }
  
  //Parse states
  for(var i=0; i<stateMachine.states.length; i++) {
    //Check states are named
    if(typeof stateMachine.states[i].name === 'undefined') {
      callback(null, "State name must be specified");
      return;
    }
    //Check state outputs are valid
    if(model == "mealy") {
      //Not allowed in mealy model
      if(typeof stateMachine.states[i].output !== 'undefined') {
        callback(null, "State outputs not allowed in strict Mealy model");
        return;
      }
    } else {
      //If output event is set
      if(typeof stateMachine.states[i].output !== 'undefined') {
        //Check output event exists
        if(!containsName(stateMachine.events, stateMachine.states[i].output)) {
         callback(null, "State " + stateMachine.states[i].name + " invalid output event " + stateMachine.states[i].output);
         return;
        }
        //Check event is an output
        var thisEvent = arrayGetNamed(stateMachine.events, stateMachine.states[i].output);
        if(thisEvent.type != "output") {
          callback(null, "State " + stateMachine.states[i].name + " event " + stateMachine.states[i].output + "is not an output");
         return;
        }
      }
    }
  }
  
  //Parse transitions
  for(var i=0; i<stateMachine.transitions.length; i++) {
    //Check transitions are named
    if(typeof stateMachine.transitions[i].name === 'undefined') {
      callback(null, "Transition name must be specified");
      return;
    }
    
    //Check from state is named
    if(typeof stateMachine.transitions[i].from === 'undefined') {
      callback(null, "Transition " + stateMachine.transitions[i].name + " from name must be specified");
      return;
    }
    
    //Check from state exists
    if(!containsName(stateMachine.states, stateMachine.transitions[i].from)) {
      callback(null, "Transition " + stateMachine.transitions[i].name + " from state" + stateMachine.transitions[i].from + " does not exist");
      return;
    }
    
    //Check to state is named
    if(typeof stateMachine.transitions[i].to === 'undefined') {
      callback(null, "Transition " + stateMachine.transitions[i].name + " to name must be specified");
      return;
    }
    
    //Check to state exists
    if(!containsName(stateMachine.states, stateMachine.transitions[i].to)) {
      callback(null, "Transition " + stateMachine.transitions[i].name + " to state " + stateMachine.transitions[i].to + " does not exist");
      return;
    }
    
    //Check trigger is named
    if(typeof stateMachine.transitions[i].trigger === 'undefined') {
      callback(null, "Transition " + stateMachine.transitions[i].name + " trigger name must be specified");
      return;
    }
    
    //Check trigger exists
    if(!containsName(stateMachine.events, stateMachine.transitions[i].trigger) && !arrayContains(triggers, stateMachine.transitions[i].trigger)) {
      callback(null, "Transition " + stateMachine.transitions[i].name + " trigger event " + stateMachine.transitions[i].trigger + " does not exist");
      return;
    }
    
    //Check state outputs are valid
    if(model == "moore") {
      //Output events not allowed in moore model
      if(typeof stateMachine.transitions[i].output !== 'undefined') {
        callback(null, "Transition " + stateMachine.transitions[i].name + " outputs not allowed in strict Moore model");
        return;
      }
    
    } else {
      //If there is an output event
      if(typeof stateMachine.transitions[i].output !== 'undefined') {
        //Check event exists
        if(!containsName(stateMachine.events, stateMachine.transitions[i].output)) {
         callback(null, "Transition " + stateMachine.transitions[i].name + " invalid output event " + stateMachine.states[i].output);
         return;
        }
        //Check event is an output
        var thisEvent = arrayGetNamed(stateMachine.events, stateMachine.transitions[i].output);
        if(thisEvent.type != "output") {
          callback(null, "Transition " + stateMachine.transitions[i].name + " event " + stateMachine.transitions[i].output + "is not an output");
         return;
        }
      }
    }
  }

  //Call callback with no error argument
  callback(stateMachine, null);
}

//Check if an array contains an object with the specified value
function arrayContains(array, value) {
  if(array.indexOf(value) == -1) {
    return false;
  } else {
    return true;
  }
}

//Check if an array contains an object with a name field matching that specified
function containsName(array, name) {
  for(var i=0; i<array.length; i++) {
    if(typeof array[i].name !== 'undefined') {
      if(array[i].name == name) {
        return true;
      }
    }
  }
  return false;
}

//Fetch a matching object from an array
function arrayGet(array, value) {
  var index = array.indexOf(value);
  if(index == -1) {
    return null;
  } else {
    return array[index];
  }
}

//Fetch a named object from an array
function arrayGetNamed(array, name) {
  for(var i=0; i<array.length; i++) {
    if(typeof array[i].name !== 'undefined') {
      if(array[i].name == name) {
        return array[i];
      }
    }
  }
  return null;
}
