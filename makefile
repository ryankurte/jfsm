
# Test requires mocha (`sudo npm install mocha')
test: FORCE
	mocha --ui tdd

# C requires libreadline and gcc (or clang)
language-c:
	node lib/jfsm.js --file=examples/UMLStateMachine.json --lang=c
	node lib/jfsm.js --file=examples/MealyStateMachine.json --lang=c
	node lib/jfsm.js --file=examples/MooreStateMachine.json --lang=c

	gcc -lreadline outputs/UMLStateMachine-main.c outputs/UMLStateMachine-stubs.c outputs/UMLStateMachine.c -o outputs/UMLStateMachine.o
	gcc -lreadline outputs/MealyStateMachine-main.c outputs/MealyStateMachine-stubs.c outputs/MealyStateMachine.c -o outputs/MealyStateMachine.o
	gcc -lreadline outputs/MooreStateMachine-main.c outputs/MooreStateMachine-stubs.c outputs/MooreStateMachine.c -o outputs/MooreStateMachine.o
	
# C# requires a working C# compiler
language-csharp:
	node lib/jfsm.js --file=examples/UMLStateMachine.json --lang=csharp
	node lib/jfsm.js --file=examples/MealyStateMachine.json --lang=csharp
	node lib/jfsm.js --file=examples/MooreStateMachine.json --lang=csharp

	mcs outputs/*.cs

test-compile: language-c language-csharp

setup:
	sudo npm install -g

install:
	@echo install not yet supported

clean:
	rm -r f outputs

FORCE:
