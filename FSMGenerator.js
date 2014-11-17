
var handlebars = require('Handlebars');
var fs = require('fs');


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

exports.generateCSource = function(stateMachine) {
	//Load source file
	var cTemplateFile = __dirname + "/generators/c/source_template.c"
	var cTemplateSource = '' + fs.readFileSync(cTemplateFile);
	//Compile template
	var cTemplate = handlebars.compile(cTemplateSource);
	//Execute template
	var result = cTemplate(stateMachine);

	return result;
}

exports.generateCHeader = function(stateMachine) {
	//Load source file
	var cTemplateFile = __dirname + "/generators/c/header_template.h"
	var cTemplateSource = '' + fs.readFileSync(cTemplateFile);
	//Compile template
	var cTemplate = handlebars.compile(cTemplateSource);
	//Execute template
	var result = cTemplate(stateMachine);

	return result;
}
