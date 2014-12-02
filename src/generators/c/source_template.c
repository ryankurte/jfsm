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
	this->current_state = {{name}}_state_{{initialState}};
}

/**
 * @brief {{name}} tick function
 */
void {{name}}_tick({{name}}_storage_t *this, int event) {
	switch(this->current_state) {
	{{#each this.states}}
	//State {{name}}
	case {{../name}}_state_{{name}}:
		//For each event
		switch(event) {
			{{! TODO: handle always true transitions }}
			//Handle applicable transitions
			{{#each ../this.transitions}}
			{{#ifCond this.from ../name}}
			case {{../../../name}}_event_{{this.trigger}}:
				{{#if ../this.guard}}
				{{! Guarded transition state change logic and handlers}}
				//Update previous state variable
				this->last_state = this->current_state;

				//Transition guard condition
				if({{{../this.guard}}}) {
					{{#if ../this.to.onTrue}}
					//Guard condition evaluated to true
					//Update state
					this->current_state = {{../../../../../name}}_state_{{../this.to.onTrue}};

					//Call handlers
					{{#if ../../../../this.onExit}}
					//Execute state {this.from} exit function
					{{../../../../../../name}}_{{this.from}}_exit_handler(this);
					{{/if}}
					{{#if this.onTransition}}
					//Execute transition {{name}} handler function
					{{../../../../../../name}}_{{name}}_transition_handler(this);
					{{/if}}
					{{#if ../../../../this.onEntry}}
					//Execute state {{this.to}} entry function
					{{../../../../../../name}}_{{this.to.onTrue}}_entry_handler(this);
					{{/if}}
					{{/if}}
				} else {
					{{#if ../this.to.onFalse}}
					//Guard condition evaluated to false
					//Update state
					this->current_state = {{../../../../../name}}_state_{{../this.to.onFalse}};

					//Call handlers
					{{#if ../../../../this.onExit}}
					//Execute state {this.from} exit function
					{{../../../../../../name}}_{{this.from}}_exit_handler(this);
					{{/if}}
					{{#if this.onTransition}}
					//Execute transition {{name}} handler function
					{{../../../../../../name}}_{{name}}_transition_handler(this);
					{{/if}}
					{{#if ../../../../this.onEntry}}
					//Execute state {{this.to}} entry function
					{{../../../../../../name}}_{{this.to.onFalse}}_entry_handler(this);
					{{/if}}
					{{/if}}
				}
				{{else}}
				{{! Simple transition state change logic and handlers}}
				//Update state
				this->last_state = this->current_state;
				this->current_state = {{../../../../name}}_state_{{this.to}};
				//Call handlers
				{{#if ../../../this.onExit}}
				//Execute state {this.from} exit function
				{{../../../../../name}}_{{this.from}}_exit_handler(this);
				{{/if}}
				{{#if this.onTransition}}
				//Execute transition {{name}} handler function
				{{../../../../../name}}_{{name}}_transition_handler(this);
				{{/if}}
				{{#if ../../../this.onEntry}}
				//Execute state {{this.to}} entry function
				{{../../../../../name}}_{{this.to}}_entry_handler(this);
				{{/if}}
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


