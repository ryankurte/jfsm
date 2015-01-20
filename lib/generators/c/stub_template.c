/**
 * @brief State machine stub implementation file
 * Generated to aid in the rapid creation of state machine implementations
 *
 * @file {{name}}-stub.c
 * @date {{date}}
 */

#define DEBUG_{{toUpperCase @root.name}}

#ifdef DEBUG_{{toUpperCase @root.name}}
#include "stdio.h"
#define DEBUG_PRINT_{{toUpperCase @root.name}}(...) printf(__VA_ARGS__)
#else
#define DEBUG_PRINT_{{toUpperCase @root.name}}(...)
#endif

#include "{{name}}.h"

/***		State and Transition Stubs				***/

//State machine transition function stubs
{{#each this.transitions}}
extern void {{@root.name}}_{{name}}_transition_handler({{@root.name}}_data_t *data) {
	DEBUG_PRINT_{{toUpperCase @root.name}}("FSM: {{@root.name}} State: {{name}} transition function called\r\n");

	return;
}
{{/each}}

//State machine state function stubs
{{#each this.states}}

{{#if this.events.onEntry}}
//State {{name}} entry function
extern void {{@root.name}}_{{name}}_entry_handler({{@root.name}}_data_t *data){
	DEBUG_PRINT_{{toUpperCase @root.name}}("FSM: {{@root.name}} State: {{name}} entry function called\r\n");

	return;
}
{{/if}}
{{#if this.events.onTick}}
//State {{name}} tick function
extern void {{@root.name}}_{{name}}_state_handler({{@root.name}}_data_t *data){
	DEBUG_PRINT_{{toUpperCase @root.name}}("FSM: {{@root.name}} State: {{name}} tick function called\r\n");

	return;
}
{{/if}}
{{#if this.events.onExit}}
//State {{name}} exit function
extern void {{@root.name}}_{{name}}_exit_handler({{@root.name}}_data_t *data){
	DEBUG_PRINT_{{toUpperCase @root.name}}("FSM: {{@root.name}} State: {{name}} exit function called\r\n");

	return;
}
{{/if}}
{{/each}}	{{! State loop }}

