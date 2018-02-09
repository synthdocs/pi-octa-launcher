var Colors = require('./Colors.js');
var state = require('./state.js');

var exports = {};
var _output = null;
var _outputColors = null


exports.init = function(output)
{
  _output = output;
  _outputColors = new Colors(_output);
}

exports.resetColors = function()
{
  _output.sendMessage([176+8, 0, 0]);
}

exports.switchToFactory = function() {
  _output.sendMessage([240,0,32,41,2,17,119,8,247]);
}

exports.isFader = function(parameter) {
  return parameter > 76 && parameter < 85;
}

exports.updateSoloState = function(){
  var soloState = state.getSoloState();
	for (var i = 0; i < soloState.length; i++ ) {
		_outputColors.setColor(8, 24 + i, soloState[i] ? Colors.GREEN : Colors.RED_LOW);
	}
}

exports.isSoloButton = function(control, parameter)
{
		if (control > 151 && control < 160) {
			if (parameter > 40 && parameter < 45) {
				return true;
			}
			if (parameter >= 57 && parameter <= 60) {
				return true;
			}
		}
		return false;
}

exports.getSoloButtonIndex = function(parameter)
{
  return (parameter > 40 && parameter < 45) ? parameter - 41 :  parameter - 53;
}

exports.isMuteButton = function(control, parameter)
{
  if (control >= 152 && control <= 159) {
    if (parameter >= 73 && parameter <= 76) {
      return true;
    }
    if (parameter >= 89 && parameter <= 92) {
      return true;
    }
  }
  return false;
}

exports.getMuteButtonIndex = function(parameter)
{
  return (parameter >= 73 && parameter <= 76) ? parameter - 73 : parameter - 85;
}

exports.updateMuteState = function(){
  var soloState = state.getMuteState();
	for (var i = 0; i < soloState.length; i++ ) {
		_outputColors.setColor(8, 32 + i, soloState[i] ? Colors.OFF : Colors.RED_LOW);
	}
}

module.exports = exports;
