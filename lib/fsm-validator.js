//JSON Finite State Machine Intermediate Representation Validator
//Checks JFSMIR files for validity

var constants = require('./fsm-constants.js');
var helpers = require('./fsm-helpers.js');

//Validates a JFSIM input state machine
exports.validate = function(stateMachine, callback) {
  
  try {
    //Check state machine headers
    if(checkHeader(stateMachine) != null) {
      return;
    }
    
    //Save selected model
    var model = stateMachine.model;
    
    //Check event definitions
    if(checkEvents(stateMachine.events, model) != null) {
      return;
    }
    
    //Check state machine logic (States and Transitions)
    if(checkStateMachine(stateMachine, model) != null) {
      return;
    }

    //Call callback with no error argument
    if(callback) {
      callback(stateMachine, null);
    }

    return null;

  } catch (error) {
    console.log(error.message);
    throw error;
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
    throw new Error("State machine name must be specified");
    return;
  }
  
  //Check model exists
  if(typeof stateMachine.model === 'undefined') {
    throw new Error("State machine model must be specified");
    return;
  }
  
  //Check model is correct
  if(!helpers.arrayContains(constants.models, stateMachine.model)) {
    throw new Error("Invalid model, options are: " + constants.models);
    return;
  }

  return null;
}

//Check state machine data
function checkData(data, model) {
  if(typeof data !== 'undefined') {

    //Data not allowed in strict Moore or Mealy models
    if((model == "mealy") || (model == "moore")) {
      throw new Error("Data objects are not allowed in Mealy or Moore models");
    }

    for(var i=0; i<data.length; i++) {
      //Check data has a name
      if(typeof data[i].name === 'undefined') {
        throw new Error("Data objects must be named");
      }
      //Check data has a type
      if(typeof data[i].type === 'undefined') {
        throw new Error("Data objects must have an associated type");
      }
    }
  }

  return null;
}

//Check state machine events are correctly defined
function checkEvents(events, model) {
  //Parse events
  for(var i=0; i<events.length; i++) {
    checkEvent(events[i]);
    if(events[i].data) {
      checkData(events[i].data, model);
    }
  }

  return null;
}

//Check a single event definition
function checkEvent(eventIn) {
  //Check events are named
  if(typeof eventIn.name === 'undefined') {
    throw new Error( "Event name must be specified");
    return;
  }
  //TODO: Check event names are not duplicated
  //Check event types exist
  if(typeof eventIn.type === 'undefined') {
    throw new Error( "Event type must be specified");
    return;
  }
  //Check event types are valid
  if(!helpers.arrayContains(constants.events, eventIn.type)) {
    throw new Error( "Event type is invalid");
    return;
  }
}

//Check initial state is correctly defined
function checkInitialState(stateMachine, states) {
  //Check initial state exists
  if(typeof stateMachine.initialState === 'undefined') {
    throw new Error( "State machine initial state must be specified");
    return;
  }
  
  //Check initial state is correct (exists in state machine)
  if(!helpers.containsName(states, stateMachine.initialState)) {
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
    throw new Error("State name must be specified");
    return;
  }
  //Check state outputs are valid
  if(model == "mealy") {
    //Not allowed in mealy model
    if(typeof state.output !== 'undefined') {
      throw new Error("State outputs not allowed in strict Mealy model");
      return;
    }
  } else {
    //If output event is set
    if(typeof state.output !== 'undefined') {
      //Check output event exists
      if(!helpers.containsName(events, state.output)) {
       throw new Error("State " + state.name + " invalid output event " + state.output);
       return;
      }
      //Check event is an output
      var thisEvent = helpers.arrayGetNamed(events, state.output);
      if(thisEvent.type != "output") {
        throw new Error("State " + state.name + " event " + state.output + "is not an output");
       return;
      }
    }
  }

  //Check state keys are valid
  for(var name in state) {
    if(!helpers.arrayContains(constants.stateKeys, name)) {
      throw new Error("Key: " + name + " is invalid in state: " + state.name);
    }
  }
}

//Check an array of transitions are valid
function checkTransitions(transitions, states, events, model) {

  //Parse transitions
  for(var i=0; i<transitions.length; i++) {
    checkTransition(transitions[i], states, events, model);
  }

  //Check there are no duplicate transitions (same event from the same state)
  var transitionMap = [];
  for(var i=0; i<transitions.length; i++) {
    if(!helpers.arrayContains(transitionMap, transitions[i].from)) {
      transitionMap.push(transitions[i].from);
    } else {
      throw new Error( "Duplicate exit transitions from state: " + transitions[i].from);
      return;
    }
  }

  return null;
}

function checkTransition(transition, states, events, model) {
  //Check transitions are named
  if(typeof transition.name === 'undefined') {
    throw new Error( "Transition name must be specified");
    return;
  }
  
  //Check from state is named
  if(typeof transition.from === 'undefined') {
    throw new Error( "Transition " + transition.name + " from name must be specified");
    return;
  }
  
  //Check from state exists
  if(!helpers.containsName(states, transition.from)) {
    throw new Error( "Transition " + transition.name + " from state " + transition.from + " does not exist");
    return;
  }
  
  //Check to state is named
  if(typeof transition.to === 'undefined') {
    throw new Error( "Transition " + transition.name + " to state(s) must be specified");
    return;
  }
  
  //Guarded transitions require two true and false states
  if(typeof transition.guard !== 'undefined') {
    //TODO: allowed in UML only
    if(model != "uml") {
      throw new Error( "Guard conditions only allowed in UML model");
      return;
    }

    //Check true state is named
    if(typeof transition.to.onTrue === 'undefined') {
      throw new Error( "Transition " + transition.name + " onTrue state must be specified");
      return;
    }
    //Check true state exists
    if(!helpers.containsName(states, transition.to.onTrue)) {
      throw new Error( "Transition " + transition.name + " onTrue state " + transition.to.onTrue + " does not exist");
      return;
    }
    //Check false state is named
    if(typeof transition.to.onFalse === 'undefined') {
      throw new Error( "Transition " + transition.name + " onFalse state must be specified");
      return;
    }
    //Check false state exists
    if(!helpers.containsName(states, transition.to.onFalse)) {
      throw new Error( "Transition " + transition.name + " onFalse state " + transition.to.onFalse + " does not exist");
      return;
    }

  //Normal transitions require only a TO state
  } else {
    //Check to state exists
    if(!helpers.containsName(states, transition.to)) {
      throw new Error( "Transition " + transition.name + " to state " + transition.to + " does not exist");
      return;
    }
  }
  
  //Check trigger is named
  if(typeof transition.trigger === 'undefined') {
    throw new Error( "Transition " + transition.name + " trigger name must be specified");
    return;
  }
  
  //Check trigger exists
  if(!helpers.containsName(events, transition.trigger) && !arrayContains(constants.triggers, transition.trigger)) {
    throw new Error( "Transition " + transition.name + " trigger event " + transition.trigger + " does not exist");
    return;
  }

  //Check trigger is an input
  if(helpers.containsName(events, transition.trigger) && (helpers.arrayGetNamed(events, transition.trigger).type != "input")) {
    throw new Error( "Transition " + transition.name + " trigger event " + transition.trigger + " is not an input");
    return;
  }
  
  //Check state outputs are valid
  if(model == "moore") {
    //Output events not allowed in moore model
    if(typeof transition.output !== 'undefined') {
      throw new Error( "Transition " + transition.name + " outputs not allowed in strict Moore model");
      return;
    }
  
  } else {
    //If there is an output event
    if(typeof transition.output !== 'undefined') {
      //Check event exists
      if(!helpers.containsName(events, transition.output)) {
       throw new Error( "Transition " + transition.name + " invalid output event " + stateMachine.states[i].output);
       return;
      }
      //Check event is an output
      var thisEvent = helpers.arrayGetNamed(events, transition.output);
      if(thisEvent.type != "output") {
        throw new Error( "Transition " + transition.name + " event " + transition.output + "is not an output");
       return;
      }
    }
  }

  //Check transition keys are valid
  for(var name in transition) {
    if(!helpers.arrayContains(constants.transitionKeys, name)) {
      throw new Error( "Key: " + name + " is invalid in transition: " + transition.name);
    }
  }
}

/***        Internal function exports for test        ***/
exports.test = {};
exports.test.checkHeader        = checkHeader;
exports.test.checkEvents        = checkEvents;
exports.test.checkInitialState  = checkInitialState;
exports.test.checkState         = checkState;
exports.test.checkStates        = checkStates;
exports.test.checkTransition    = checkTransition;
exports.test.checkTransitions   = checkTransitions;
exports.test.checkData          = checkData;


