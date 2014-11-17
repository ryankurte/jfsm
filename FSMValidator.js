//JSON Finite State Machine Intermediate Representation Validator
//Checks JFSMIR files for validity

var constants = require('./FSMConstants');

//Validates a JFSIM input state machine
exports.validate = function(source, callback) {
  //Convert to javascript object
  var stateMachine = JSON.parse(source);
  
  //Check state machine headers
  if(checkHeader(stateMachine, callback) != null) {
    return;
  }
  
  //Save selected model
  var model = stateMachine.model;
  
  //Check event definitions
  if(checkEvents(stateMachine.events, callback) != null) {
    return;
  }

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
  
  //Check states
  if(checkStates(stateMachine.states, stateMachine.events, model, callback) != null) {
    return;
  }
  
  //Check transitions
  if(checkTransitions(stateMachine.transitions, stateMachine.states, stateMachine.events, model, callback) != null) {
    return;
  }

  //Call callback with no error argument
  callback(stateMachine, null);
}

/***        Internal Validation Functions        ***/

//Check JSON encoded state machine header information
function checkHeader(stateMachine, callback) {
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
  if(!arrayContains(constants.models, stateMachine.model) == -1) {
    callback(null, "Invalid model, options are: mixed, mealy, moore");
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

  return null;
}

//Check state machine events are correctly defined
function checkEvents(events, callback) {
  //Parse events
  for(var i=0; i<events.length; i++) {
    //Check events are named
    if(typeof events[i].name === 'undefined') {
      callback(null, "Event name must be specified");
      return;
    }
    //Check event types exist
    if(typeof events[i].type === 'undefined') {
      callback(null, "Event type must be specified");
      return;
    }
    //Check event types are valid
    if(!arrayContains(constants.events, events[i].type)) {
      callback(null, "Event type is invalid");
      return;
    }
  }

  return null;
}

//Check states are valid
function checkStates(states, events, model, callback) {
  //Parse states
  for(var i=0; i<states.length; i++) {
    //Check states are named
    if(typeof states[i].name === 'undefined') {
      callback(null, "State name must be specified");
      return;
    }
    //Check state outputs are valid
    if(model == "mealy") {
      //Not allowed in mealy model
      if(typeof states[i].output !== 'undefined') {
        callback(null, "State outputs not allowed in strict Mealy model");
        return;
      }
    } else {
      //If output event is set
      if(typeof states[i].output !== 'undefined') {
        //Check output event exists
        if(!containsName(events, states[i].output)) {
         callback(null, "State " + states[i].name + " invalid output event " + states[i].output);
         return;
        }
        //Check event is an output
        var thisEvent = arrayGetNamed(events, states[i].output);
        if(thisEvent.type != "output") {
          callback(null, "State " + states[i].name + " event " + states[i].output + "is not an output");
         return;
        }
      }
    }
  }

  return null;
}

function checkTransitions(transitions, states, events, model, callback) {
  //Parse transitions
  for(var i=0; i<transitions.length; i++) {
    //Check transitions are named
    if(typeof transitions[i].name === 'undefined') {
      callback(null, "Transition name must be specified");
      return;
    }
    
    //Check from state is named
    if(typeof transitions[i].from === 'undefined') {
      callback(null, "Transition " + transitions[i].name + " from name must be specified");
      return;
    }
    
    //Check from state exists
    if(!containsName(states, transitions[i].from)) {
      callback(null, "Transition " + transitions[i].name + " from state" + transitions[i].from + " does not exist");
      return;
    }
    
    //Check to state is named
    if(typeof transitions[i].to === 'undefined') {
      callback(null, "Transition " + transitions[i].name + " to name must be specified");
      return;
    }
    
    //Check to state exists
    if(!containsName(states, transitions[i].to)) {
      callback(null, "Transition " + transitions[i].name + " to state " + transitions[i].to + " does not exist");
      return;
    }
    
    //Check trigger is named
    if(typeof transitions[i].trigger === 'undefined') {
      callback(null, "Transition " + transitions[i].name + " trigger name must be specified");
      return;
    }
    
    //Check trigger exists
    if(!containsName(events, transitions[i].trigger) && !arrayContains(constants.triggers, transitions[i].trigger)) {
      callback(null, "Transition " + transitions[i].name + " trigger event " + transitions[i].trigger + " does not exist");
      return;
    }

    //Check trigger is an input
    if(containsName(events, transitions[i].trigger) && (arrayGetNamed(events, transitions[i].trigger).type != "input")) {
      callback(null, "Transition " + transitions[i].name + " trigger event " + transitions[i].trigger + " is not an input");
      return;
    }
    
    //Check state outputs are valid
    if(model == "moore") {
      //Output events not allowed in moore model
      if(typeof transitions[i].output !== 'undefined') {
        callback(null, "Transition " + transitions[i].name + " outputs not allowed in strict Moore model");
        return;
      }
    
    } else {
      //If there is an output event
      if(typeof transitions[i].output !== 'undefined') {
        //Check event exists
        if(!containsName(events, transitions[i].output)) {
         callback(null, "Transition " + transitions[i].name + " invalid output event " + stateMachine.states[i].output);
         return;
        }
        //Check event is an output
        var thisEvent = arrayGetNamed(events, transitions[i].output);
        if(thisEvent.type != "output") {
          callback(null, "Transition " + transitions[i].name + " event " + transitions[i].output + "is not an output");
         return;
        }
      }
    }
  }

  return null;
}

/***        Internal Array Functions        ***/

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
