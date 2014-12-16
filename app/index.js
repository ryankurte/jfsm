var gui = require('nw.gui');
var fs = require('fs');
var helpers = require('../src/fsm-helpers');

var graph = new joint.dia.Graph;
var uml = joint.shapes.uml;
var win = gui.Window.get();

//Set up window
win.isKioskMode = false;
win.setResizable(true);

//Create paper object
var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: $(document).width(),
    height: $(document).height(),
    gridSize: 10,
    model: graph
});


var file = fs.readFileSync("./UMLStateMachine.json");

var sm = JSON.parse(file);

var states = [];

//Render states
states.push(new uml.StartState({
    position: { x:20  , y: 20 },
    size: { width: 30, height: 30 },
}));

sm.states.forEach(function(state, index) {
    var newState = new uml.State({
        position: state.position,
        size: state.size,
        name: state.name,
        events: ["test"]
    });

    //Attach id for later traversal
    state.id = newState.id;

    states.push(newState);
});

graph.addCells(states);

var transitions = [];

transitions.push(new uml.Transition({
    source: {id: states[0].id}, 
    target: {id: helpers.arrayGetNamed(sm.states, sm.initialState).id}
}));

sm.transitions.forEach(function(transition, index) {
    console.log("Transition: " + transition.from + "->" + transition.to);
    console.log(transition);

    var from = helpers.arrayGetNamed(sm.states, transition.from);

    if(typeof transition.guard === 'undefined') {
        //Single destination
        var to = helpers.arrayGetNamed(sm.states, transition.to);
        var newTransition = new uml.Transition({source: {id: from.id}, target: {id: to.id }})

        //Attach id for later traversal
        transition.id = newTransition.id;

        transitions.push(newTransition);

    } else {
        //Multiple destinations, uh.

    }


    
});

graph.addCells(transitions);