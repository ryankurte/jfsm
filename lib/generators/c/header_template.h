/**
 * TODO: header
 *
 * @file {{name}}.h
 * @date {{date}}
 */

#ifndef {{@root.name}}_H
#define {{@root.name}}_H

/***		Definitions									***/

//State enumerations
enum {{@root.name}}_state_e {
	{{#each this.states}}
	{{@root.name}}_state_{{name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
};

//Event enumerations
enum {{@root.name}}_event_e {
	{{root.name}}_event_none,
	{{#each this.events}}
	{{@root.name}}_event_{{name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
};

//State machine data structure (this is available to user defined functions)
typedef struct {{@root.name}}_data_s {
	{{#each this.data}}
	{{this.type}} {{this.name}};{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
} {{@root.name}}_data_t;

//State machine storage type (stores state machine instance information)
typedef struct {{@root.name}}_storage_s {
	int current_state;
	int last_state;
	{{@root.name}}_data_t data;
} {{@root.name}}_storage_t;

/***		External interfaces							***/
//These methods are automatically generated for the given state machine

//Initialize state machine object
extern void {{@root.name}}_init({{name}}_storage_t *this);

//State machine tick function
extern void {{@root.name}}_tick({{name}}_storage_t *this);

//Pass an event to the state machine
extern void {{@root.name}}_send_event({{name}}_storage_t *this, int event, void* data);

//Fetch an event from the state machine
extern void {{@root.name}}_get_event({{name}}_storage_t *this, int *event, void* data);

/***		State and Transition Handler Stubs			***/
//These should be implemented in the user source code

//State machine transition function prototypes
{{#each this.transitions}}
extern void {{@root.name}}_{{name}}_transition_handler({{@root.name}}_data_t *data);
{{/each}}

//State machine state function prototypes
{{#each this.states}}

{{#if this.events.onEntry}}
//State {{name}} entry function
extern void {{@root.name}}_{{name}}_entry_handler({{@root.name}}_data_t *data);
{{/if}}
{{#if this.events.onTick}}
//State {{name}} tick function
extern void {{@root.name}}_{{name}}_state_handler({{@root.name}}_data_t *data);
{{/if}}
{{#if this.events.onExit}}
//State {{name}} exit function
extern void {{@root.name}}_{{name}}_exit_handler({{@root.name}}_data_t *data);
{{/if}}
{{/each}}	{{! State loop }}

#endif
