//JSON Finite State Machine Intermediate Representation Validator
//Checks JFSMIR files for validity

var constants = require('./FSMConstants');

//Validates a JFSIM input state machine
exports.validate = function(source, callback) {
  //Convert to javascript object
  var stateMachine = JSON.parse(source);
  
  try {
    //Check state machine headers
    if(checkHeader(stateMachine) != null) {
      return;
    }
    
    //Save selected model
    var model = stateMachine.model;
    
    //Check event definitions
    if(checkEvents(stateMachine.events) != null) {
      return;
    }
    
    //Check state machine logic (States and Transitions)
    if(checkStateMachine(stateMachine, model) != null) {
      return;
    }

    //Call callback with no error argument
    callback(stateMachine, null);

    return null;

  } catch (error) {
    console.log(error.message);
  }
  
}

/***        Internal Validation Functions                 ***/

function checkStateMachine(stateMachine, model) {
  //Check initial state
  if(checkInitialState(stateMachine, stateMachine.states) != null) {
    return;
  }

  //Check states are valid
  if(checkStates(stateMachine.states, stateMachine.events, model) != null) {
    return;
  }
  
  //Check transitions are valid
  if(checkTransitions(stateMachine.transitions, stateMachine.states, stateMachine.events, model) != null) {
    return;
  }

  return null;
}

//Check JSON encoded state machine header information
function checkHeader(stateMachine) {
  //Check name exists
  if(typeof stateMachine.name === 'undefined') {
    throw new Error( "State machine name must be specified");
    return;
  }
  
  //Check model exists
  if(typeof stateMachine.model === 'undefined') {
    throw new Error( "State machine model must be specified");
    return;
  }
  
  //Check model is correct
  if(!arrayContains(constants.models, stateMachine.model)) {
    throw new Error( "Invalid model, options are: mixed, mealy, moore");
    return;
  }

  return null;
}

//Check state machine events are correctly defined
function checkEvents(events) {
  //Parse events
  for(var i=0; i<events.length; i++) {
    //Check events are named
    if(typeof events[i].name === 'undefined') {
      throw new Error( "Event name must be specified");
      return;
    }
    //TODO: Check event names are not duplicated
    //Check event types exist
    if(typeof events[i].type === 'undefined') {
      throw new Error( "Event type must be specified");
      return;
    }
    //Check event types are valid
    if(!arrayContains(constants.events, events[i].type)) {
      throw new Error( "Event type is invalid");
      return;
    }
  }

  return null;
}

function checkInitialState(stateMachine, states) {

  //Check initial state exists
  if(typeof stateMachine.initialState === 'undefined') {
    throw new Error( "State machine initial state must be specified");
    return;
  }
  
  //Check initial state is correct (exists in state machine)
  if(!containsName(states, stateMachine.initialState)) {
    throw new Error( "State machine initial state " + stateMachine.initialState + " does not exist");
    return;
  }

  return null;
}

//Check an array of states are valid
function checkStates(states, events, model) {
  //Parse states
  for(var i=0; i<states.length; i++) {
    checkState(states[i], events, model);
  }

  return null;
}

//Check a state is valid
function checkState(state, events, model) {
  //Check state is named
  if(typeof state.name === 'undefined') {
    throw new Error( "State name must be specified");
    return;
  }
  //Check state outputs are valid
  if(model == "mealy") {
    //Not allowed in mealy model
    if(typeof state.output !== 'undefined') {
      throw new Error( "State outputs not allowed in strict Mealy model");
      return;
    }
  } else {
    //If output event is set
    if(typeof state.output !== 'undefined') {
      //Check output event exists
      if(!containsName(events, state.output)) {
       throw new Error( "State " + state.name + " invalid output event " + state.output);
       return;
      }
      //Check event is an output
      var thisEvent = arrayGetNamed(events, state.output);
      if(thisEvent.type != "output") {
        throw new Error( "State " + state.name + " event " + state.output + "is not an output");
       return;
      }
    }
  }
}

function checkTransitions(transitions, states, events, model) {

  //Parse transitions
  for(var i=0; i<transitions.length; i++) {
    //Check transitions are named
    if(typeof transitions[i].name === 'undefined') {
      throw new Error( "Transition name must be specified");
      return;
    }
    
    //Check from state is named
    if(typeof transitions[i].from === 'undefined') {
      throw new Error( "Transition " + transitions[i].name + " from name must be specified");
      return;
    }
    
    //Check from state exists
    if(!containsName(states, transitions[i].from)) {
      throw new Error( "Transition " + transitions[i].name + " from state" + transitions[i].from + " does not exist");
      return;
    }
    
    //Check to state is named
    if(typeof transitions[i].to === 'undefined') {
      throw new Error( "Transition " + transitions[i].name + " to name must be specified");
      return;
    }
    
    //Check to state exists
    if(!containsName(states, transitions[i].to)) {
      throw new Error( "Transition " + transitions[i].name + " to state " + transitions[i].to + " does not exist");
      return;
    }
    
    //Check trigger is named
    if(typeof transitions[i].trigger === 'undefined') {
      throw new Error( "Transition " + transitions[i].name + " trigger name must be specified");
      return;
    }
    
    //Check trigger exists
    if(!containsName(events, transitions[i].trigger) && !arrayContains(constants.triggers, transitions[i].trigger)) {
      throw new Error( "Transition " + transitions[i].name + " trigger event " + transitions[i].trigger + " does not exist");
      return;
    }

    //Check trigger is an input
    if(containsName(events, transitions[i].trigger) && (arrayGetNamed(events, transitions[i].trigger).type != "input")) {
      throw new Error( "Transition " + transitions[i].name + " trigger event " + transitions[i].trigger + " is not an input");
      return;
    }
    
    //Check state outputs are valid
    if(model == "moore") {
      //Output events not allowed in moore model
      if(typeof transitions[i].output !== 'undefined') {
        throw new Error( "Transition " + transitions[i].name + " outputs not allowed in strict Moore model");
        return;
      }
    
    } else {
      //If there is an output event
      if(typeof transitions[i].output !== 'undefined') {
        //Check event exists
        if(!containsName(events, transitions[i].output)) {
         throw new Error( "Transition " + transitions[i].name + " invalid output event " + stateMachine.states[i].output);
         return;
        }
        //Check event is an output
        var thisEvent = arrayGetNamed(events, transitions[i].output);
        if(thisEvent.type != "output") {
          throw new Error( "Transition " + transitions[i].name + " event " + transitions[i].output + "is not an output");
         return;
        }
      }
    }
  }

  return null;
}

/***        Internal function exports for test        ***/
exports.test = {};
exports.test.checkHeader        = checkHeader;
exports.test.checkEvents        = checkEvents;
exports.test.checkInitialState  = checkInitialState;
exports.test.checkState         = checkState;
exports.test.checkStates        = checkStates;
exports.test.checkTransitions   = checkTransitions;

/***        Internal Array Functions                  ***/

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
