/**
 * TODO: header
 */

#ifndef {{name}}_H
#define {{name}}_H

/***		Definitions									***/

//State enumerations
enum {{name}}_state_e {
	{{#each this.states}}
	{{../name}}_state_{{name}},
	{{/each}}
};

//Event enumerations
enum {{name}}_event_e {
	{{../name}}_event_none,
	{{#each this.events}}
	{{../name}}_event_{{name}},
	{{/each}}
};

//State machine storage type
typedef struct {{name}}_storage_t {
	int current_state;
};

/***		External interfaces							***/
//These methods are automatically generated
extern void {{name}}_init(&{{name}}_storage_t this);

extern void {{name}}_tick(&{{name}}_storage_t this);

/***		State and Transition Handlers				***/

//State machine transition prototypes
//These should be implemented in the user source code
{{#each this.transitions}}
extern void {{../name}}_{{name}}_transition_handler(void);
{{/each}}

//State machine state prototypes
//These should be implemented in the user source code
{{#each this.states}}
extern void {{../name}}_{{name}}_state_handler(void);
{{/each}}

#endif
