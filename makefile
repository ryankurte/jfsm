mealy:
	node .\main.js .\examples\MealyStateMachine.json

moore:
	node .\main.js .\examples\MooreStateMachine.json

test:
	mocha --ui tdd