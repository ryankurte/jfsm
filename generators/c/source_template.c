/**
 * TODO: header
 */

#include "{{this.name}}.h"

void {{name}}_init(&{{name}}_storage_t this) {
	//Set initial state
	this->currentState = {{initialState}};
}

void {{name}}_tick(&{{name}}_storage_t this, int event) {
	switch(this->currentState) {
		{{#each this.states}}
		case {{../name}}_state_{{name}}:
			switch(event) {
				//TODO: handle always true transitions
				{{#each ../this.transitions}}
				{{#ifCond this.from ../name}}
				case {{this.trigger}}:
					this->currentState = {{this.to}};
					{{#ifCond ../../../model "mealy"}}
					//Mealy, execute transition function
					{{../../../../name}}_{{name}}_transition_handler();
					{{else}}
					//Moore, execute new state
					{{../../../../name}}_{{this.to}}_state_handler();
					{{/ifCond}}
				break;
				{{else}}
				{{/ifCond}}
				{{/each}}

				{{#ifCond ../model "moore"}}
				//Moore default tick handler
				default:
					{{../../name}}_{{name}}_state_handler();
				break;
				{{else}}
				{{/ifCond}}
			}
			
			break;
		{{/each}}
	}
}


