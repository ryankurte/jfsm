#  JSON Finite State Machine (JFMS) Representation, Validation and Generation


This project defines semantics for representation of single level Finite State Machines (FSMs) using JavaScript Object Notation (JSON), as an intermediate language for graphical generation, analysis of FSM execution, and generation of state machines in other languages.


The motivation being that a significant portion of embedded code (read: all) is finite automata of some sort, and the common methods of describing and implementing FSMs in C (and other languages) require an enormous amount of boilerplate code, and result in generally complex and unclear implementations. There has to be a better way.


The goals of this are:
 - to provide a fairly standard intermediate representation for state machines, that can be used for rendering, editing, validation or generation.
   - that is easily human readable and editable without machine assistance (ie. IDEs)
   - that is useful to programmers, rather than architects (although this may not be exclusive).
 - to decouple the definition of a state machine from it's implementation
   - in a manner that does not interfere with development (ie. lets you write code where you want to write code).
 - to provide a tool for generating state machine implementations from this intermediate representation.
   - in a manner that integrates with a minimal development environment (text editor and CLI builder)


JSON was selected due to it's usability as a human readable format (for ease of writing and editing), and the ease of conversion into JavaScript objects, which should allow (near) direct execution of the JFSM state machine intermediate representation.


Originally this was intended to integrate all the features required to be compliant with UML StateCharts, however this added massive (unnecessary) complexity without a demonstrated need. So, Minimum Viable Project it is.

This was also to provide functionality for wiring of state machines for elegant system level design, however for now it seems that simply generating state machines offers enough utility, and generating state machines with standard interfaces will allow other projects to worry about wiring and models of execution.

It seems better to start by trying to solve a small problem well and moving from there [[1](https://en.wikipedia.org/wiki/John_Gall_(author)#Gall.27s_law)]

## Project State

[![Build Status](https://travis-ci.org/ryankurte/jfsm.svg)](https://travis-ci.org/ryankurte/jfsm)

### Specification
Only by example (and in this README), see ./examples for example JSON files.

This will be developed as we attempt to actually use the generator and discover issues / annoyances with the spec.

### Validation
See lib/fsm-validator.js

Fairly complete. Validates Mealy, Moore and Extended state machines.

Needs cleanup for simplification.

### Generation
See lib/fsm-generator.js

Fairly complete. Generator functionality mostly implemented, generator templates need some work.

Generator uses handlebars style templates with a JSON language specification file, see ./lib/generators/c for an up to date example.

### Visualization
See app/

Barely started. Visualization app could be build using node-webkit with joint.js rendering.

examples/UMLStateMachine.json currently contains some keys for rendering, however this (IMO) makes the state machine less clear, so alternate methods are to be investigated.

## Current Generators

| Language      | Status                | Tests  |
| ------------- |-----------------------|--------|
| c             | Supported             | TODO   |
| c#            | Needs Updating        | TODO   |
| javascript    | Unsupported           | TODO   |

## Getting Started

 - Installation requires node.js and npm.
 - Install dependencies with `npm install`.
 - Example State Machines are located in the /examples directory.
 - To run the jfsm utility locally, use `node lib/jfsm.js`
 - To install the jfsm utility globally, use `npm install -g ./`, then call `jfsm` to execute
 - To generate and compile the example state machines in c, use `make language-c`. Outputs will be placed in the ./outputs folder. Note that this requires gcc and libreadline (from build-essential and libreadline-dev packages).
 - To generate and compile the example state machines in c# , use `make language-csharp`. Outputs will be placed in the ./outputs folder. Note that this requires the mcs and mono executables (from mono-devel and mono-mcs packages on linux).
 - For example commands, check out the makefile.

## Usage
`jfsm --file [statemachine.json] --lang [language] --output [output directory]`
nb. file and language (lang) arguments are required. Output folder defaults to './outputs'.

## Semantics

State machines should be defined as demonstrated in the example files
The onSomething entries (ie. "onEntry":true) inform the state machine generator that a user function should be called in this case. In C this generates an unimplemented function definition in the state machine header for the user to implement, in higher level languages this generates abstract methods that are to be implemented by the user.
An example of these methods can be viewed in outputs/UMLStateMachine.h after running `make language-c`

 - name - name of the state machine
 - model - either Mealy, Moore, or Mixed. If the model is not mixed, the state machine will be checked to comply with the specified semantics. UML mode is not UML compliant, and will probably be replaced with another name in the future.
 - data - variables associated with the state machine for use with extended and UML state machines.
 - events - sets the named events to be used as inputs and outputs of the state machine, type must be specified (input or output).
 - states - sets the named states in the state machine, output ("output") events may be specified here for use with Moore machines. Depending on the model used, states may have entry ("onEntry":true), tick ("onTick":true), and exit ("onExit":true) functions.
 - transitions - sets the named transitions between states, along with trigger events. Output events may be specified here for Mealy machines. Depending on the model used, transitions may have associated functions ("onTransition:true"). Transitions are triggered by the specified "trigger" event (which must be an input), and can cause an "output" event on transition.
 - guards - guard conditions enable, disable, or choose between transitions based on boolean operations. Note that operations may only refer to data defined in the state machine.
 - comments - comments are allowed on all objects and should be translated through into generated source code.

## Tasks

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
 - ~~add tests to Travis-ci.org~~
 - add to npm to allow simple installation of the utilities
 - improve documentation / help
 - refactor monolithic (awful) validation module into separate components
 - update generator to allow default or external templates

## Layout

 - ./lib/ contains javascript source files
 - ./lib/generators contains language generator files
 - ./test contains test files
 - ./examples contains example JSON state machines

## References

 - http://en.wikipedia.org/wiki/UML_state_machine
 - http://www.omg.org/spec/
 - http://www.uml-diagrams.org/state-machine-diagrams.html

## Alternatives
 - http://www.w3.org/TR/scxml/
 - https://www.lrde.epita.fr/~lesaint/lesaint-fsmxml.pdf
 - https://code.google.com/p/scxmlcc/

## Discussions
 - Should these discussions be issues? Why am I talking to myself?
 - Should transitions be triggerable internally or only due to external stimulus?
   - Current approach requires external event and an optional guard condition to transition
   - "True" event would allow guard conditions to be used to transition without external event, but add requirements to the JSON file
   - Return true to trigger transition would also work, but is less clear
   - Transitions probably all be defined in the JSON, otherwise the top level diagram is incomplete
 - Do transitions need priority to ensure correct operation?
 - Should events require an input or output type (ie. strict internal or external use and directions)


If you find a problem, or a need, Issues, Feature Requests or Pull Requests are more than welcome.
