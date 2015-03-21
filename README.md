#JSON Finite State Machine (JFMS) Representation, Validation and Generation

This project defines semantics for representation of single level Finite State Machines (FSMs) using JavaScript Object Notation (JSON), as an intermediate language for graphical generation, analysis of FSM execution, and generation of state machines in other languages.

The goals of this are to first to provide a fairly standard intermediate representation for state machines, that can be used for rendering, editing, validation or generation, and from that to provide a tool for generating state machine implementations from this intermediate representation.

JSON was selected due to it's usability as a human readable format, and the ease of conversion into javascript objects, which should allow (near) direct execution of the JFSM state machine intermediate representation.

Originally this was intended to integrate all the features required to be compliant with UML StateCharts, however this added massive (unnecessary) complexity without a demonstrated need. So, Minimum Viable Project it is.
This was also to provide functionality for wiring of state machines for elegant system level design, however for now it seems that simply generating state machines offers enough utility, and generating state machines with standard interfaces will allow other projects to worry about wiring and models of execution.
It seems better to start by trying to solve a small problem well and moving from there [[1](https://en.wikipedia.org/wiki/John_Gall_(author)#Gall.27s_law)]

##Project State
###Specification
Only by example (and in this README), see ./examples for example JSON files.

###Validation
Fairly complete. Validates Mealy, Moore and Extended state machines.
Needs cleanup for simplification.

###Generation
Fairly complete. Generator functionality mostly implemented, generator templates need some work.
Generator uses handlebars style templates with a JSON language specification file, see ./lib/generators/c for an up to date example.

##Current Generators

| Language      | Status        		| Tests  |
| ------------- |-----------------------|--------|
| c     		| Supported             | TODO   |
| c#	        | Needs Updating        | TODO   |
| javascript 	| Unsupported           | TODO   |

##Getting Started

 - Installation requires node.js and npm.
 - Install dependencies with `npm install`
 - Example State Machines are located in the /examples directory
 - To run the jfsm utility locally, use `node lib/jfsm.js`
 - To install the jfsm utility globally, use `npm install -g ./`, then call `jfsm` to execute
 - For example commands, check out the makefile

##Semantics

State machines should be defined as demonstrated in the example files

 - name - name of the state machine
 - model - either Mealy, Moore, or Mixed. If the model is not mixed, the state machine will be checked to comply with the specified semantics
 - data - variables associated with the state machine for use with extended and UML state machines
 - events - sets the named events to be used as inputs and outputs of the state machine, type must be specified (input or output).
 - states - sets the named states in the state machine, output events may be specified here for use with Moore machines. Depending on the model used, states may have entry ("onEntry":true), tick ("onTick":true), and exit ("onExit":true) functions.
 - transitions - sets the named transitions between states, along with trigger events. Output events may be specified here for Mealy machines. Depending on the model used, transitions may have associated functions ("onTransition:true")
 - guards - guard conditions enable, disable, or choose between transitions based on boolean operations. Note that operations may only refer to data defined in the state machine.
 - comments - comments are allowed on all objects and should be translated through into generated source code

##Tasks

 - add comment support to all objects
 - validate keys for all objects (not just correctness)
 - allow "true" events in FSMs
 - check only one "true" condition exists per state
 - ~~disallow multiple transitions from the same state and event~~
 - check for orphaned (disconnected) states
 - ~~build support for wiring together of state machine modules~~ - simplification, not required for generation
 - ~~switch to passing data object rather than state machine object~~
 - implement internal event outputs / triggers for transitions
 - javascript state machine shim
 - add tests to Travis-ci.org
 - add to npm to allow simple installation of the utilities
 - improve documentation / help

##Layout

 - ./lib/ contains javascript source files
 - ./lib/generators contains language generator files
 - ./test contains test files
 - ./examples contains example JSON state machines

##References

 - http://en.wikipedia.org/wiki/UML_state_machine
 - http://www.omg.org/spec/
 - http://www.uml-diagrams.org/state-machine-diagrams.html

##Discussions
 - Should these discussions be issues? Why am I talking to myself?
 - Should transitions be triggerable internally or only due to external stimulus?
   - Current approach requires external event and an optional guard condition to transition
   - "True" event would allow guard conditions to be used to transition without external event, but add requirements to the JSON file
   - Return true to trigger transition would also work, but is less clear
   - Transitions probably all be defined in the JSON, otherwise the top level diagram is incomplete
 - Do transitions need priority to ensure correct operation?
 - Should events require an input or output type (ie. strict internal or external use and directions)
