#JSON Finite State Machine Intermediate Representation (JFSMIR)

Semantics for the representation of single level Finite State Machines (FSMs) using JavaScript Object Notation (JSON), as an intermediate language for graphical generation, analysis of FSM execution, and eventual generation of state machines in lower level languages. 

JSON was selected due to it's usability as a human readible format, and the ease of conversion into javascript objects, which should allow (near) direct execution of the JFSM state machine intermediate representation.

##Semantics
State machines should be defined as demonstrated in the example files

 - name - name of the state machine
 - model - either Mealy, Moore, or Mixed. If the model is not mixed, the state machine will be checked to comply with the specified semantics
 - queueLength - sets the length of the event queues used for communication
 - data - variables associated with the state machine for use with extended and UML state machines
 - events - sets the named events to be used as inputs and outputs of the state machine, type must be specified (input or output).
 - states - sets the named states in the state machine, output events may be specified here for use with Moore machines. Depending on the model used, states may have entry ("onEntry":true), tick ("onTick":true), and exit ("onExit":true) functions.
 - transitions - sets the named transitions between states, along with trigger events. Output events may be specified here for Mealy machines. Depending on the model used, transitions may have associated functions ("onTransition:true")
 - comments - comments are allowed on all objects and should be translated through into generated source code

##UML Compliance
Update to match UML state machine specification, this will require the following:
Should prioritize based on usefulness, not necessary to have full coverage.

 - Guards - guard conditions enable and disable transitions based on a boolean operations
 - Run to Completion Operation
 - Hierarchical State Machines (nested/embedded states, what state depth is required?)
 - Orthogonal Regions (concurrent state machines)
 - Internal transitions - transitions that cause execution of an internal action without a state transition
 - Transition Execution Sequence
 - Local Transitions - alternate to external transitions, does not cause exit and reentry from the main target state if the main state is a sub-state of the main source
 - Event Deferral - states can have a list of events that will be deferred until entry of a state that does not have the event in it's deferral list

##Tasks
 - add comment support to all objects
 - validate keys for all objects (not just correctness)
 - check only one "true" condition exists in the FSM
 - allow "true" events in FSMs
 - disallow multiple transitions from the same state and event


##References
http://en.wikipedia.org/wiki/UML_state_machine
http://www.omg.org/spec/
http://www.uml-diagrams.org/state-machine-diagrams.html

##Discussions
 - Do transitions need priority to ensure correct operation?
 - Should events require an input or output type (ie. strict internal or external use and directions)
