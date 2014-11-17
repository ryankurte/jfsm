
var assert = require('assert');
var validator = require('./FSMValidator');
var fs = require('fs');

//Full JSON state machine file tests
suite('FullTests', function() {
	//Full Mealy implementation
	suite('Mealy', function() {
		test('Parse full Mealy state machine', function() {
			var mealyExampleFile = __dirname + "/examples/MealyStateMachine.json"
			var mealySource = fs.readFileSync(mealyExampleFile);
			validator.validate(mealySource, function(stateMachine, err) {
				assert.equal(err, null, 'Error parsing Mealy state machine');
			});
		});
	});
	//Full Moore implementation
	suite('Moore', function() {
		test('Parse full Moore state machine', function() {
			var mooreExampleFile = __dirname + "/examples/MooreStateMachine.json"
			var mooreSource = fs.readFileSync(mooreExampleFile);

			validator.validate(mooreSource, function(stateMachine, err) {
				assert.equal(err, null, 'Error parsing Moore state machine');
			});
		});
	});
});

//Header tests
suite('Header Validation', function() {
	//Prepare passing header
	setup(function() {
		stateMachine = {
			name: "testName",
			model: "mealy",
			queueLength: 1
		};
	});
	test('Check header is OK', function() {
		assert.equal(validator.test.checkHeader(stateMachine), null);
	});

	test('Check name exists', function() {
		delete stateMachine.name;
		assert.throws(
		  function() {
		    validator.test.checkHeader(stateMachine);
		  },
		  Error
		);
	});

	test('Check model exists', function() {
		delete stateMachine.model;
		assert.throws(
		  function() {
		    validator.test.checkHeader(stateMachine);
		  },
		  Error
		);
	});

	test('Check model is correct', function() {
		stateMachine.model = "wrong";
		assert.throws(
		  function() {
		    validator.test.checkHeader(stateMachine);
		  },
		  Error
		);
	});
});

//Event tests
suite('Event Validation', function() {
	//Prepare passing header
	setup(function() {
		events = [
		{name: "testEventOne", type :"input"},
		{name: "testEventTwo", type: "output"},
		{name: "testEventThree", type: "internal"}];
	});
	test('Check test events are OK', function() {
		assert.equal(validator.test.checkEvents(stateMachine), null);
	});

	test('Check event name exists', function() {
		delete events[0].name;
		assert.throws(
		  function() {
		    validator.test.checkEvents(events);
		  },
		  Error
		);
	});

	test('Check event type exists', function() {
		delete events[0].type;
		assert.throws(
		  function() {
		    validator.test.checkEvents(events);
		  },
		  Error
		);
	});

	test('Check event type is correct', function() {
		events[0].type = "wrong";
		assert.throws(
		  function() {
		    validator.test.checkEvents(events);
		  },
		  Error
		);
	});
});

//Initial state tests
suite('Initial State', function() {
	//Prepare passing header
	setup(function() {
		stateMachine = {initialState: "testInitialState"};
		states = [{name: "testInitialState"}];
	});
	test('Check test initial state is OK', function() {
		assert.equal(validator.test.checkInitialState(stateMachine, states), null);
	});

	test('Check initial state exists', function() {
		delete stateMachine.initialState;
		assert.throws(
		  function() {
		    validator.test.checkInitialState(stateMachine, states);
		  },
		  Error
		);
	});

	test('Check initial state is correct', function() {
		stateMachine.initialState = "wrong";
		assert.throws(
		  function() {
		    validator.test.checkInitialState(stateMachine, states);
		  },
		  Error
		);
	});
});

//State tests
suite('State Validation', function() {
	//Prepare passing header
	setup(function() {
		events = [
		{name: "testEventOne", type: "output"},
		{name: "testEventTwo", type: "input"},
		{name: "testEventThree", type: "internal"}];
	});

	suite('Mealy', function() {
		setup(function() {
			state = {name: "testStateOne", type :"input"};
		});

		test('Check test state is OK', function() {
			assert.equal(validator.test.checkState(state, events, "mealy"), null);
		});

		test('Check state name exists', function() {
			delete state.name;
			assert.throws(
			  function() {
			    validator.test.checkState(state, events, "mealy");
			  },
			  Error
			);
		});

		test('Check state outputs are not allowed', function() {
			state.output = events[0].name;
			assert.throws(
			  function() {
			    validator.test.checkState(state, events, "mealy");
			  },
			  Error
			);
		});
	});

	suite('Moore', function() {
		setup(function() {
			state = {name: "testStateOne", type :"input", output: events[0].name};
		});

		test('Check test state is OK', function() {
			assert.equal(validator.test.checkState(state, events, "moore"), null);
		});

		test('Check state name exists', function() {
			delete state.name;
			assert.throws(
			  function() {
			    validator.test.checkState(state, events, "moore");
			  },
			  Error
			);
		});

		test('Check state output event is valid', function() {
			state.output = "wrong"
			assert.throws(
			  function() {
			    validator.test.checkState(state, events, "moore");
			  },
			  Error
			);
		});

		test('Check state output event is output type', function() {
			state.output = events[1].name;
			assert.throws(
			  function() {
			    validator.test.checkState(state, events, "moore");
			  },
			  Error
			);
		});
	});
});