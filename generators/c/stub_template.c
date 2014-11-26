/**
 * @brief State machine stub implementation file
 * Generated to aid in the rapid creation of state machine implementations
 *
 * @file {{name}}-stub.c
 * @date {{date}}
 */

#ifdef DEBUG_{{toUpperCase name}}
#include "stdio.h"
#define DEBUG_PRINT_{{toUpperCase name}}(...) printf(__VA_ARGS)
#else
#define DEBUG_PRINT_{{toUpperCase name}}(...)
#endif

#include "{{name}}.h"

/***		State and Transition Stubs				***/

//State machine transition function stubs
{{#each this.transitions}}
extern void {{../name}}_{{name}}_transition_handler({{../name}}_storage_t *this) {
	DEBUG_PRINT_{{toUpperCase ../name}}("FSM: {../name}} State: {{name}} transition function called\r\n");

	return;
}
{{/each}}

//State machine state function stubs
{{#each this.states}}

{{#if this.onEntry}}
//State {{name}} entry function
extern void {{../../name}}_{{name}}_entry_handler({{../../name}}_storage_t *this){
	DEBUG_PRINT_{{toUpperCase ../../name}}("FSM: {../../name}} State: {{name}} entry function called\r\n");

	return;
}
{{/if}}
{{#if this.onTick}}
//State {{name}} tick function
extern void {{../../name}}_{{name}}_state_handler({{../../name}}_storage_t *this){
	DEBUG_PRINT_{{toUpperCase ../../name}}("FSM: {../name}} State: {{name}} tick function called\r\n");

	return;
}
{{/if}}
{{#if this.onExit}}
//State {{name}} exit function
extern void {{../../name}}_{{name}}_exit_handler({{../../name}}_storage_t *this){
	DEBUG_PRINT_{{toUpperCase ../../name}}("FSM: {../name}} State: {{name}} exit function called\r\n");

	return;
}
{{/if}}
{{/each}}	{{! State loop }}

