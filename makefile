uml:
	node src/main.js examples/UMLStateMachine.json
	
mealy:
	node src/main.js examples/MealyStateMachine.json

moore:
	node src/main.js examples/MooreStateMachine.json


#Test requires mocha (`sudo npm install mocha')
test:
	mocha --ui tdd

test-compile: uml mealy moore
	gcc -lreadline outputs/UMLStateMachine-main.c outputs/UMLStateMachine-stubs.c outputs/UMLStateMachine.c -o outputs/UMLStateMachine.o
	gcc -lreadline outputs/MealyStateMachine-main.c outputs/MealyStateMachine-stubs.c outputs/MealyStateMachine.c -o outputs/MealyStateMachine.o
	gcc -lreadline outputs/MooreStateMachine-main.c outputs/MooreStateMachine-stubs.c outputs/MooreStateMachine.c -o outputs/MooreStateMachine.o
	mcs outputs/*.cs

setup:
	sudo npm install -g

install:
	@echo install not yet supported

clean:
	rm -r f outputs
