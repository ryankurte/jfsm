var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 800,
    height: 600,
    gridSize: 1,
    model: graph
});


var uml = joint.shapes.uml;

var states = {

    s0: new uml.StartState({
        position: { x:20  , y: 20 },
        size: { width: 30, height: 30 },
    }),

    s1: new uml.State({
        position: { x:100  , y: 100 },
        size: { width: 200, height: 100 },
        name: "state 1",
        events: ["entry / init()","exit / destroy()"]
    }),

    s2: new uml.State({
        position: { x:400  , y: 200 },
        size: { width: 300, height: 300 },
        name: "state 2",
        events: ["entry / create()","exit / kill()","A / foo()","B / bar()"]
    }),

    s3: new uml.State({
        position: { x:130  , y: 400 },
        size: { width: 160, height: 60 },
        name: "state 3",
        events: ["entry / create()","exit / kill()"]
    }),

    s4: new uml.State({
        position: { x:530  , y: 400 },
        size: { width: 160, height: 50 },
        name: "sub state 4",
        events: ["entry / create()"]
    }),

    se: new uml.EndState({
        position: { x:750  , y: 550 },
        size: { width: 30, height: 30 },
    })

};

graph.addCells(states);

states.s2.embed(states.s4);

var transitons = [
    new uml.Transition({ source: { id: states.s0.id }, target: { id: states.s1.id }}),
    new uml.Transition({ source: { id: states.s1.id }, target: { id: states.s2.id }}),
    new uml.Transition({ source: { id: states.s1.id }, target: { id: states.s3.id }}),
    new uml.Transition({ source: { id: states.s3.id }, target: { id: states.s4.id }}),
    new uml.Transition({ source: { id: states.s2.id }, target: { id: states.se.id }})
];

graph.addCells(transitons);