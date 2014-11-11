#JSON Finite State Machine Intermediate Representation (JFSMIR)

Semantics for the representation of single level Finite State Machines (FSMs) using JavaScript Object Notation (JSON), as an intermediate language for graphical generation, analysis of FSM execution, and eventual generation of state machines in lower level languages. 

JSON was selected due to it's usability as a human readible format, and the ease of conversion into javascript objects, which should allow (near) direct execution of the JFSM state machine intermediate representation.

##Semantics
State machines should be defined as demonstrated in ExampleStateMachine.json.
 - name - name of the state machine
 - model - either Mealy, Moore, or Mixed. If the model is not mixed, the state machine will be checked to comply with the specified semantics
 - queueLength - sets the length of the event queues used for communication
 - events - sets the named events to be used as inputs and outputs of the state machine
 - states - sets the named states in the state machine, output events may be specified here for use with Moore machines
 - transitions - sets the named transitions between states, along with trigger events. Output events may be specified here for Mealy machines
