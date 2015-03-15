/**
 * TODO: header
 *
 * @file {{name}}.c
 * @date {{date}}
 */

#include "{{@root.name}}.h"

#include <stdlib.h>

/**
 * @brief {{@root.name}} initialization function
 */
void {{@root.name}}_init({{name}}_storage_t *this) {
	//Set initial state
	this->current_state = {{@root.name}}_state_{{initialState}};
}

/**
 * @brief {{name}} tick function
 */
void {{@root.name}}_tick({{@root.name}}_storage_t *this) {

	//Fetch data for use in user functions
	{{@root.name}}_data_t *data = &this->data;

	switch(this->current_state) {
	{{#each this.states}}
	//State {{@root.name}}
	case {{@root.name}}_state_{{name}}:
		//For each event
		switch(this->event_in) {
			{{! TODO: handle always true transitions }}
			//Handle applicable transitions
			{{#each ../this.transitions}}
			{{#ifCond this.from ../name}}
			case {{@root.name}}_event_{{this.trigger}}:
				{{#if ../this.guard}}
				{{! Guarded transition state change logic and handlers}}
				//Update previous state variable
				this->last_state = this->current_state;

				//Transition guard condition
				if({{{../this.guard}}}) {
					{{#if ../this.to.onTrue}}
					//Guard condition evaluated to true
					//Update state
					this->current_state = {{@root.name}}_state_{{../this.to.onTrue}};

					//Call handlers
					{{#if ../../../../this.events.onExit}}
					//Execute state {this.from} exit function
					{{@root.name}}_{{this.from}}_exit_handler(&this->data);
					{{/if}}
					{{#if this.onTransition}}
					//Execute transition {{name}} handler function
					{{@root.name}}_{{name}}_transition_handler(&this->data);
					{{/if}}
					{{#if ../../../../this.events.onEntry}}
					//Execute state {{this.to}} entry function
					{{@root.name}}_{{this.to.onTrue}}_entry_handler(&this->data);
					{{/if}}
					{{/if}}
				} else {
					{{#if ../this.to.onFalse}}
					//Guard condition evaluated to false
					//Update state
					this->current_state = {{@root.name}}_state_{{../this.to.onFalse}};

					//Call handlers
					{{#if ../../../../this.events.onExit}}
					//Execute state {this.from} exit function
					{{@root.name}}_{{this.from}}_exit_handler(&this->data);
					{{/if}}
					{{#if this.onTransition}}
					//Execute transition {{name}} handler function
					{{@root.name}}_{{name}}_transition_handler(&this->data);
					{{/if}}
					{{#if ../../../../this.events.onEntry}}
					//Execute state {{this.to}} entry function
					{{@root.name}}_{{this.to.onFalse}}_entry_handler(&this->data);
					{{/if}}
					{{/if}}
				}
				{{else}}
				{{! Simple transition state change logic and handlers}}
				//Update state
				this->last_state = this->current_state;
				this->current_state = {{@root.name}}_state_{{this.to}};
				//Call handlers
				{{#if ../../../this.events.onExit}}
				//Execute state {this.from} exit function
				{{@root.name}}_{{this.from}}_exit_handler(&this->data);
				{{/if}}
				{{#if this.onTransition}}
				//Execute transition {{name}} handler function
				{{@root.name}}_{{name}}_transition_handler(&this->data);
				{{/if}}
				{{#if ../../../this.events.onEntry}}
				//Execute state {{this.to}} entry function
				{{@root.name}}_{{this.to}}_entry_handler(&this->data);
				{{/if}}
				{{/if}}

			break;
			{{else}}
			{{/ifCond}}
			{{/each}}

			//Default tick handler
			default:
				{{#if this.events.onTick}}
				//Execute state tick function
				{{@root.name}}_{{name}}_state_handler(&this->data);
				{{/if}}
			break;
		}
		
	break;
	{{/each}}
	}

	this->event_in = {{@root.name}}_event_none;
	this->data_in = NULL;
}

//Pass an event to the state machine
void {{@root.name}}_put_event({{name}}_storage_t *this, int event, void* data)
{
	//TODO: place valid input event into input queue
	//TODO: handle invalid event inputs
	this->event_in = event;
	this->data_in = data;
}

//Fetch an event from the state machine
void {{@root.name}}_get_event({{name}}_storage_t *this, int *event, void** data)
{	
	//TODO: fetch event from output queue
	*event = this->event_out;
	*data = this->data_out;
}


