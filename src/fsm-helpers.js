/***        Internal Array Functions                  ***/

//Check if an array contains an object with the specified value
exports.arrayContains = function(array, value) {
  if(array.indexOf(value) == -1) {
    return false;
  } else {
    return true;
  }
}

//Check if an array contains an object with a name field matching that specified
exports.containsName = function(array, name) {
  for(var i=0; i<array.length; i++) {
    if(typeof array[i].name !== 'undefined') {
      if(array[i].name == name) {
        return true;
      }
    }
  }
  return false;
}

//Fetch a matching object from an array
exports.arrayGet = function(array, value) {
  var index = array.indexOf(value);
  if(index == -1) {
    return null;
  } else {
    return array[index];
  }
}

//Fetch a named object from an array
exports.arrayGetNamed = function(array, name) {
  for(var i=0; i<array.length; i++) {
    if(typeof array[i].name !== 'undefined') {
      if(array[i].name == name) {
        return array[i];
      }
    }
  }
  return null;
}