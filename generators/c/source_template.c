/**
 * TODO: header
 *
 * @file {{name}}.c
 * @date {{date}}
 */

#include "{{this.name}}.h"

/**
 * @brief {{name}} initialization function
 */
void {{name}}_init({{name}}_storage_t *this) {
	//Set initial state
	this->currentState = {{initialState}};
}

/**
 * @brief {{name}} tick function
 */
void {{name}}_tick({{name}}_storage_t *this, int event) {
	switch(this->currentState) {
	{{#each this.states}}
	//State {{name}}
	case {{../name}}_state_{{name}}:
		//For each event
		switch(event) {
			{{! TODO: handle always true transitions }}
			//Handle applicable transitions
			{{#each ../this.transitions}}
			{{#ifCond this.from ../name}}
			case {{this.trigger}}:
				this->lastState = this->currentState;
				this->currentState = {{this.to}};
				{{#if ../../this.onExit}}
				//Execute state {this.from} exit function
				{{../../../../name}}_{{this.from}}_exit_handler(this);
				{{/if}}
				{{#if this.onTransition}}
				//Execute transition {{name}} handler function
				{{../../../../name}}_{{name}}_transition_handler(this);
				{{/if}}
				{{#if ../../this.onEntry}}
				//Execute state {{this.to}} entry function
				{{../../../../name}}_{{this.to}}_entry_handler(this);
				{{/if}}
			break;
			{{else}}
			{{/ifCond}}
			{{/each}}

			//Default tick handler
			default:
				{{#if this.onTick}}
				//Execute state tick function
				{{../../name}}_{{name}}_state_handler(this);
				{{/if}}
			break;
		}
		
	break;
	{{/each}}
	}
}


