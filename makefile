
# Test requires mocha (`sudo npm install mocha')
test: FORCE
	mocha --ui tdd

# C requires libreadline and gcc (or clang)
language-c:
	node lib/jfsm.js --file=examples/UMLStateMachine.json --lang=c
	node lib/jfsm.js --file=examples/MealyStateMachine.json --lang=c
	node lib/jfsm.js --file=examples/MooreStateMachine.json --lang=c

	gcc outputs/UMLStateMachine-main.c outputs/UMLStateMachine-stubs.c outputs/UMLStateMachine.c -o outputs/UMLStateMachine.o -lreadline
	gcc outputs/MealyStateMachine-main.c outputs/MealyStateMachine-stubs.c outputs/MealyStateMachine.c -o outputs/MealyStateMachine.o -lreadline
	gcc outputs/MooreStateMachine-main.c outputs/MooreStateMachine-stubs.c outputs/MooreStateMachine.c -o outputs/MooreStateMachine.o -lreadline 
	
# C# requires a working C# compiler
language-csharp:
	node lib/jfsm.js --file=examples/UMLStateMachine.json --lang=csharp
	node lib/jfsm.js --file=examples/MealyStateMachine.json --lang=csharp
	node lib/jfsm.js --file=examples/MooreStateMachine.json --lang=csharp

	mcs outputs/UMLStateMachine.cs outputs/UMLStateMachine-main.cs outputs/UMLStateMachine-stubs.cs -out:outputs/UMLStateMachine.exe
	mcs outputs/MealyStateMachine.cs outputs/MealyStateMachine-main.cs outputs/MealyStateMachine-stubs.cs -out:outputs/MealyStateMachine.exe
	mcs outputs/MooreStateMachine.cs outputs/MooreStateMachine-main.cs outputs/MooreStateMachine-stubs.cs -out:outputs/MooreStateMachine.exe

test-compile: language-c language-csharp

test-install: install
	which jfsm

setup:
	npm install -g

install:
	npm install -g ./

clean:
	rm -r f outputs

FORCE:
