
var handlebars = require('handlebars');
var fs = require('fs');
var helpers = require('./fsm-helpers.js');

//-----------	Handlebars helper functions		-----------//

handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
});

handlebars.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
});

handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
})

handlebars.registerHelper('camelCase', function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
});

//-----------	External functions				-----------//

//Generate source for a given language type
exports.generateSource = function(language, outputDir, stateMachine) {
	//Load language information
	//TODO: add search path, local directory then installation directory
	var languagePath = __dirname + "/generators/" + language + "/";
	var languageFile = languagePath + "language.json";
	var languageData = JSON.parse('' + fs.readFileSync(languageFile));
	//TODO: language data file validator to check language file is correct and templates exist.

	//Check output directory exists
	if(!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}

	//Load features for state machine generation
	stateMachine.date = Date();
	stateMachine.eventNames = getUniqueEvents(stateMachine.events);
	stateMachine.language = language;

	//Prepend language specific data accessors to guard conditions
	stateMachine.transitions.forEach(function(transition, index) {
		if(typeof transition.guard !== 'undefined') {
			console.log(transition.guard);
			stateMachine.data.forEach(function(data, index) {
				var newName = languageData.accessor + data.name;
				transition.guard = transition.guard.replace(data.name, newName);
			});
		}
	});

	console.log("Generating output files for language: " + language);

	//For each template file
	for(var i=0; i<languageData.templates.length; i++) {
		//Load the template
		var templateFile = languagePath + languageData.templates[i].name;
		var templateSource = '' + fs.readFileSync(templateFile);
		//TODO: check template file loaded
		//Compile the template
		var template = handlebars.compile(templateSource);
		//Execute the template to generate code
		var result = template(stateMachine);
		//Save the resultant code
		var outputFile = outputDir + "/" + stateMachine.name + languageData.templates[i].extension;
		fs.writeFileSync(outputFile, result);

		console.log("Wrote file " + languageData.templates[i].name + " \t-> " +  outputFile)
	}

	console.log("State machine generation complete");
}

function getUniqueEvents(events) {
	uniqueEvents = [];

	for(var i=0; i<events.length; i++) {
		if(!helpers.containsName(uniqueEvents, events[i].name)) {
			uniqueEvents.push(events[i]);
		}
	}

	return uniqueEvents;
}



