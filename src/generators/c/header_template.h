/**
 * TODO: header
 *
 * @file {{name}}.h
 * @date {{date}}
 */

#ifndef {{name}}_H
#define {{name}}_H

/***		Definitions									***/

//State enumerations
enum {{name}}_state_e {
	{{#each this.states}}
	{{../name}}_state_{{name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
};

//Event enumerations
enum {{name}}_event_e {
	{{name}}_event_none,
	{{#each this.events}}
	{{../name}}_event_{{name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
};

//State machine storage type
typedef struct {{name}}_storage_s {
	int current_state;
	int last_state;
	{{#each this.data}}
	{{this.type}} {{this.name}};{{#if this.comment}}		//!< {{this.comment}}{{/if}}
	{{/each}}
} {{name}}_storage_t;

/***		External interfaces							***/
//These methods are automatically generated for the given state machine

/**
 * Initializes the state machine object
 */
extern void {{name}}_init({{name}}_storage_t *this);

/**
 * State machine tick function
 */
extern void {{name}}_tick({{name}}_storage_t *this, int event);

/***		State and Transition Handlers				***/
//These should be implemented in the user source code

//State machine transition function prototypes
{{#each this.transitions}}
extern void {{../name}}_{{name}}_transition_handler({{../name}}_storage_t *this);
{{/each}}

//State machine state function prototypes
{{#each this.states}}

{{#if this.onEntry}}
//State {{name}} entry function
extern void {{../../name}}_{{name}}_entry_handler({{../../name}}_storage_t *this);
{{/if}}
{{#if this.onTick}}
//State {{name}} tick function
extern void {{../../name}}_{{name}}_state_handler({{../../name}}_storage_t *this);
{{/if}}
{{#if this.onExit}}
//State {{name}} exit function
extern void {{../../name}}_{{name}}_exit_handler({{../../name}}_storage_t *this);
{{/if}}
{{/each}}	{{! State loop }}

#endif
