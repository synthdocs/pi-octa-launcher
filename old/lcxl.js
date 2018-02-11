var Colors = require('./Colors.js');
var state = require('./state.js');

var exports = {};
var _output = null;
var _outputColors = null


exports.init = function(output)
{
  _output = output;
  _outputColors = new Colors(_output);

  exports.switchToUser();
  exports.resetColors();
  exports.updateSoloState();
  exports.updateMuteState();
}

exports.resetColors = function()
{
  for (var i = 0 ; i < 8; i++ ) {
    _outputColors.setColors(i, [
        [0, Colors.RED],
        [1, Colors.RED],
        [2, Colors.GREEN],
        [3, Colors.GREEN],
        [4, Colors.GREEN],
        [5, Colors.AMBER],
        [6, Colors.AMBER],
        [7, Colors.AMBER],
        [8, Colors.RED],
        [9, Colors.RED],
        [10, Colors.GREEN],
        [11, Colors.GREEN],
        [12, Colors.GREEN],
        [13, Colors.AMBER],
        [14, Colors.AMBER],
        [15, Colors.AMBER],
        [16, Colors.RED],
        [17, Colors.RED],
        [18, Colors.YELLOW],
        [19, Colors.YELLOW],
        [20, Colors.YELLOW],
        [21, Colors.GREEN],
        [22, Colors.GREEN],
        [23, Colors.GREEN]
      ]);
  }
}

exports.switchToUser = function() {
  _output.sendMessage([240,0,32,41,2,17,119,0,247]);
}

exports.isFader = function(control, parameter) {
  return control === 176 && parameter > 76 && parameter < 85;
}

exports.getKnob = function(message){
  if (message[0] === 176) {
    if (13 <= message[1] && message[1] <= 20) {
      return [0, message[1] - 13];
    }
    if (29 <= message[1] && message[1] <= 36) {
      return [1, message[1] - 29];
    }
    if (49 <= message[1] && message[1] <= 56) {
      return [2, message[1] - 49];
    }
  }
  return false;
}

exports.isTemplateChange = function(messages) {
  var truth = [240,0,32,41,2,17,119];
  if (
    truth[0] === messages[0] &&
    truth[1] === messages[1] &&
    truth[2] === messages[2] &&
    truth[3] === messages[3] &&
    truth[4] === messages[4] &&
    truth[5] === messages[5] &&
    truth[6] === messages[6]
  ) {
    return true;
  }
  return false;
}

exports.whichTemplateOn = function(messages) {
  return messages[7];
}

exports.updateSoloState = function(){
  var soloState = state.getSoloState();

  var states = soloState.map(function(item, index){
    return [24+index, item ? Colors.GREEN : Colors.RED_LOW]
  });

  for (var i=0; i<8;i++) {
    _outputColors.setColors(i, states);
  }
}

exports.isSoloButton = function(control, parameter)
{
		if (control === 144) {
			if (parameter >= 41 && parameter <= 44) {
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
  if (control === 144) {
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
  var states = soloState.map(function(item, index){
    return [32+index, item ? Colors.OFF : Colors.RED_LOW]
  });

  for (var i=0; i<8;i++) {
    _outputColors.setColors(i, states);
  }
}

module.exports = exports;
