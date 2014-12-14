/**
 * TODO: header
 *
 * @file {{name}}.c
 * @date {{date}}
 */

namespace {{camelCase @root.name}}
{
	public abstract class {{camelCase @root.name}}
	{
		/***		Enumerations	 		    ***/

		//State enumerations
		private enum States {
			{{#each this.states}}
			{{camelCase name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
			{{/each}}
		};

		//Event enumerations
		public enum Events {
			None,
			{{#each this.events}}
			{{camelCase name}},{{#if this.comment}}		//!< {{this.comment}}{{/if}}
			{{/each}}
		};

		/***		Internal Storage 			***/
		private States currentState;
		private States lastState;
		{{#each this.data}}
		private {{this.type}} {{this.name}};{{#if this.comment}}	//!< {{this.comment}}{{/if}}
		{{/each}}

		/***		External functions 			***/

		//Initialization function
		public void init() {
			//Set initial state
			this.currentState = States.{{initialState}};
		}

		//{{@root.name}} tick function
		public void tick(Events eventIn) {
			switch(this.currentState) {
				{{#each this.states}}
				//State {{@root.name}}
				case States.{{camelCase name}}:
					//For each event
					switch(eventIn) {
						{{! TODO: handle always true transitions }}
						//Handle applicable transitions
						{{#each ../this.transitions}}
						{{#ifCond this.from ../name}}
						case Events.{{camelCase this.trigger}}:
							{{#if ../this.guard}}
							{{! Guarded transition state change logic and handlers}}
							//Update previous state variable
							this.lastState = this.currentState;

							//Transition guard condition
							if({{{../this.guard}}}) {
								{{#if ../this.to.onTrue}}
								//Guard condition evaluated to true
								//Update state
								this.currentState = States.{{camelCase ../this.to.onTrue}};

								//Call handlers
								{{#if ../../../../this.onExit}}
								//Execute state {this.from} exit function
								{{camelCase this.from}}ExitHandler();
								{{/if}}
								{{#if this.onTransition}}
								//Execute transition {{name}} handler function
								{{camelCase name}}TransitionHandler();
								{{/if}}
								{{#if ../../../../this.onEntry}}
								//Execute state {{this.to}} entry function
								{{camelCase this.to.onTrue}}EntryHandler();
								{{/if}}
								{{/if}}
							} else {
								{{#if ../this.to.onFalse}}
								//Guard condition evaluated to false
								//Update state
								this.currentState = States.{{../this.to.onFalse}};

								//Call handlers
								{{#if ../../../../this.onExit}}
								//Execute state {this.from} exit function
								{{camelCase this.from}}ExitHandler();
								{{/if}}
								{{#if this.onTransition}}
								//Execute transition {{name}} handler function
								{{camelCase name}}TransitionHandler();
								{{/if}}
								{{#if ../../../../this.onEntry}}
								//Execute state {{this.to}} entry function
								{{camelCase this.to.onFalse}}EntryHandler();
								{{/if}}
								{{/if}}
							}
							{{else}}
							{{! Simple transition state change logic and handlers}}
							//Update state
							this.lastState = this.currentState;
							this.currentState = States.{{this.to}};
							//Call handlers
							{{#if ../../../this.onExit}}
							//Execute state {this.from} exit function
							{{camelCase this.from}}ExitHandler();
							{{/if}}
							{{#if this.onTransition}}
							//Execute transition {{name}} handler function
							{{camelCase name}}TransitionHandler();
							{{/if}}
							{{#if ../../../this.onEntry}}
							//Execute state {{this.to}} entry function
							{{camelCase this.to}}EntryHandler();
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
							{{camelCase name}}StateHandler();
							{{/if}}
						break;
					}
					
				break;
				{{/each}}
			}
		}

		/***		Implementation function stubs 			***/

		//State machine transition function stubs
		{{#each this.transitions}}
		protected abstract void {{camelCase name}}TransitionHandler();
		{{/each}}

		//State machine state function stubs
		{{#each this.states}}

		{{#if this.onEntry}}
		//State {{name}} entry function
		protected abstract void {{camelCase name}}EntryHandler();
		{{/if}}
		{{#if this.onTick}}
		//State {{name}} tick function
		protected abstract void {{camelCase name}}StateHandler();
		{{/if}}
		{{#if this.onExit}}
		//State {{name}} exit function
		protected abstract void {{camelCase name}}ExitHandler();
		{{/if}}
		{{/each}}	{{! State loop }}
	}
}


