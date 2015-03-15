/**
 * @brief Main file template
 * @details Demonstrates the use of generated state machines
 * 
 * @file {{file}}-main.c
 * @date {{date}}
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <readline/readline.h>
 #include <readline/history.h>

#include "{{@root.name}}.h"

void show_help(void);

int main(int argc, char** argv) {
	int running = 1;
	{{@root.name}}_storage_t fsm;

	//Set up prompt string
	char shell_prompt[] = "> ";

	show_help();

	//Initialise FSM
	{{@root.name}}_init(&fsm);

	while(running) {
		char *input = NULL;

		//Read a line from the console
		input = readline(shell_prompt);

		//Add the line to history
		add_history(input);

		//Parse input
		if(strncmp(input, "tick", 4) == 0) {
			//Tick command
			{{@root.name}}_tick(&fsm);

		{{! Event inputs}}
		{{#each this.events}}
		} else if(strncmp(input, "{{this.name}}", strlen("{{this.name}}")) == 0) {
			{{#ifCond this.type "input"}}
			printf("Input event: {{../name}}\r\n");
			{{@root.name}}_put_event(&fsm, {{@root.name}}_event_{{../name}}, NULL);
			{{else}}
			printf("Error: {{../name}} is not an input event\r\n");
			{{/ifCond}}
		{{/each}}

		{{@root.name}}_tick(&fsm);

		} else if ((strncmp(input, "help", 4) == 0)) {
			show_help();

		} else if((strncmp(input, "quit", 4) == 0) || (strncmp(input, "exit", 4) == 0)) {
			running = 0;

		} else {
			printf("Invalid command: %s\r\n", input);
		}

		//Free the currentline
		free(input);
	}

	return 0;
}

void show_help(void) {
	printf("Auto Generated State Machine Main\n");
	printf("State Machine: {{@root.name}}\n");
	printf("Generated: {{@root.date}}\n");
	printf("Commands:\n");
	printf("tick - causes the state machine to tick\n");
	printf("Input events:\n");
	{{#each this.events}}
	printf("{{name}}\n");
	{{/each}}
}

