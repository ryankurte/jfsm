//JSON Finite State Machine Intermediate Representation Executor
//Adds execution shims to directly execute JFSMIR

exports.init = function(stateMachine) {
  //Set up persistent variables
  stateMachine.currentState = stateMachine.initialState;
  stateMachine.previousState = stateMachine.initialState;
  
  stateMachine.eventInQueue = [];
  stateMachine.eventOutQueue = [];
}

exports.run = function(stateMachine) {
  //Fetch current state
  var state = stateMachine.currentState;
  //Fetch any pending events
  for(var i=0; i<stateMachine.eventInQueue; i++) {
    //Check if transitions should occur
    //Break if a transition occurs
  }
  
  //Empty event in queue
  stateMachine.eventInQueue = [];
}

