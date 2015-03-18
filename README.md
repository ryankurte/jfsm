#JSON Finite State Machine (JFMS) Representation, Validation and Generation

This project defines semantics for representation of single level Finite State Machines (FSMs) using JavaScript Object Notation (JSON), as an intermediate language for graphical generation, analysis of FSM execution, and generation of state machines in other languages.

JSON was selected due to it's usability as a human readable format, and the ease of conversion into javascript objects, which should allow (near) direct execution of the JFSM state machine intermediate representation.

##Current Generators

| Language      | Status        		| Tests  |
| ------------- |-----------------------|--------|
| c     		| Supported             | TODO   |
| c#	        | Needs Update          | TODO   |
|javascript 	| Unsupported           | TODO   |

##Getting Started

 - Installation requires node.js and npm.
 - Install dependencies with `npm install`
 - Examples are located in the /examples directory
 - For example commands, check out the makefile

##Semantics

State machines should be defined as demonstrated in the example files

 - name - name of the state machine
 - model - either Mealy, Moore, or Mixed. If the model is not mixed, the state machine will be checked to comply with the specified semantics
 - data - variables associated with the state machine for use with extended and UML state machines
 - events - sets the named events to be used as inputs and outputs of the state machine, type must be specified (input or output).
 - states - sets the named states in the state machine, output events may be specified here for use with Moore machines. Depending on the model used, states may have entry ("onEntry":true), tick ("onTick":true), and exit ("onExit":true) functions.
 - transitions - sets the named transitions between states, along with trigger events. Output events may be specified here for Mealy machines. Depending on the model used, transitions may have associated functions ("onTransition:true")
 - guards - guard conditions enable, disable, or choose between transitions based on a boolean operations
 - comments - comments are allowed on all objects and should be translated through into generated source code

##Tasks

 - add comment support to all objects
 - validate keys for all objects (not just correctness)
 - check only one "true" condition exists in the FSM
 - allow "true" events in FSMs
 - ~~disallow multiple transitions from the same state and event~~
 - check for orphaned states
 - ~~build support for wiring together of state machine modules~~ - simplification, not required for generation
 - ~~switch to passing data object rather than state machine object~~
 - implement event outputs / internal triggers for transitions
 - javascript state machine shim

##Layout

 - lib/ contains javascript source files
 - lib/generators contains language generator files
 - test contains test files
 - examples contains example JSON state machines

##References

 - http://en.wikipedia.org/wiki/UML_state_machine
 - http://www.omg.org/spec/
 - http://www.uml-diagrams.org/state-machine-diagrams.html

##Discussions

 - Do transitions need priority to ensure correct operation?
 - Should events require an input or output type (ie. strict internal or external use and directions)
