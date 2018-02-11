var exports = {};
var _soloState = [0,0,0,0,0,0,0,0];
var _muteState = [0,0,0,0,0,0,0,0];
var _faderState = [0,0,0,0,0,0,0,0];
var _blinkingState = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];
var _machineState = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];
var _currentTemplate = 0;
var _turningPushingStates = [];

exports.initTemplateStates = function(){
  for (var i = 0; i < 8; i++)
  {
    _turningPushingStates.push([
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ]);
  };
}

var updateMachineState = function(x, y, value) {
  _machineState[x][y] = value;
}

exports.updateCurrentState = function(x, y, value){
  _turningPushingStates[getCurrentTemplate()][x][y] = value;
  updateMachineState(x, y, value);
}

var getMachineVsTemplateState = function()
{
  var knobState = _turningPushingStates[getCurrentTemplate()];
  var machineState = _machineState;
  var diff = [];
  for (var x = 0; x < 3; x++) {
    var tmp = [];
    for (var y = 0; y < 8; y++) {
      var tmpValue = 0;
      if (knobState[x][y] > machineState[x][y]) {
        tmpValue = 1;
      } else if (knobState[x][y] < machineState[x][y]) {
        tmpValue = -1;
      }
      tmp.push(tmpValue)
    }
    diff.push(tmp)
  }
  return diff;
}

exports.allStates = function(){
  return _turningPushingStates;
}

exports.printAllStates = function()
{
  console.log('diff', getMachineVsTemplateState())
  console.log('machine', _machineState);
  console.log('knobs', _turningPushingStates);
  console.log('faders', _faderState);
  console.log('upper buttons', _soloState);
  console.log('lower buttons', _muteState);
}

exports.updateFaderState = function(x, value)
{
  _faderState[x] = value;
  updateMachineState(3, x, value);
}

exports.setCurrentTemplate = function(index)
{
  _currentTemplate = index;
}

var getCurrentTemplate = function()
{
  return _currentTemplate;
}

exports.getSoloState = function()
{
  return _soloState;
}

exports.setSoloState = function(index, onOff)
{
  _soloState[index] = onOff;
}

exports.toggleSoloState = function(index)
{
  _soloState[index] ^= true;
  return _soloState[index];
}

exports.getMuteState = function()
{
  return _muteState;
}

exports.toggleMuteState = function(index)
{
  _muteState[index] ^= true;
  return _muteState[index];
}

exports.setMuteState = function(index, onOff)
{
  _muteState[index] = onOff;
}
exports.updateMachineState = updateMachineState;
exports.getCurrentTemplate = getCurrentTemplate;

exports.initTemplateStates();


module.exports = exports;
