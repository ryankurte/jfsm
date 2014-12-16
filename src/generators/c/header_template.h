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
	{{name}}_event_none,
	{{#each this.events}}
	{{@root.name}}_event_{{name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
};

typedef struct {{@root.name}}_data_s {
	{{#each this.data}}
	{{this.type}} {{this.name}};{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
} {{@root.name}}_data_t;

//State machine storage type
typedef struct {{@root.name}}_storage_s {
	int current_state;
	int last_state;
	{{@root.name}}_data_t data;
} {{@root.name}}_storage_t;

/***		External interfaces							***/
//These methods are automatically generated for the given state machine

/**
 * Initializes the state machine object
 */
extern void {{@root.name}}_init({{name}}_storage_t *this);

/**
 * State machine tick function
 */
extern void {{@root.name}}_tick({{name}}_storage_t *this, int event);

/***		State and Transition Handlers				***/
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
