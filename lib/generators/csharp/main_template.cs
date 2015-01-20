/**
 * @brief Main file template
 * @details Demonstrates the use of generated state machines
 * 
 * @file {{file}}-main.cs
 * @date {{date}}
 */

using System;

namespace {{@root.name}}
{
	class {{camelCase @root.name}}Main
	{
		private static bool running;
		private static {{camelCase @root.name}}Impl stateMachine = new {{camelCase @root.name}}Impl();

		public static void Main() {
			running = true;

			//Initialise FSM
			stateMachine.init();

			while(running) {
				string line = Console.ReadLine();

				//Parse input
				if(String.Compare(line, "tick") == 0) {
					//Tick command
					stateMachine.tick({{name}}.Events.None);

				{{! Event inputs}}
				{{#each this.events}}
				} else if(String.Compare(line, "{{this.name}}") == 0) {
					{{#ifCond this.type "input"}}
					stateMachine.tick({{camelCase @root.name}}.Events.{{camelCase ../name}});
					{{else}}
					Console.WriteLine("Error: {{../name}} is not an input event\r\n");
					{{/ifCond}}
				{{/each}}

				} else if((String.Compare(line, "quit") == 0) || (String.Compare(line, "exit") == 0)) {
					running = false;

				} else {
					Console.WriteLine("Invalid command: %s\r\n", line);
				}
			}
		}
	}
}

