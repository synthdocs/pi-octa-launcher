var midi = require('midi');
var exports = {};

exports.listAllDevices = function()
{
  var midiInputs = new midi.input();
  for (var i = 0; i < midiInputs.getPortCount(); i++)
  {
    console.log('Input: ' + i + ' : ' + midiInputs.getPortName(i));
  }
  var midiOutput = new midi.output();
  for (var i = 0; i < midiInputs.getPortCount(); i++)
  {
    console.log('Input: ' + i + ' : ' + midiInputs.getPortName(i));
  }
}

exports.findInputWithName = function(name)
{
  var midiInputs = new midi.input();
  for (var i = 0; i < midiInputs.getPortCount(); i++)
  {
  	if (midiInputs.getPortName(i).indexOf(name) !== -1) {
      midiInputs.ignoreTypes(false, false, false);
      midiInputs.openPort(i);
      return midiInputs;
  	}
  }
  return false;
}

exports.findOutputWithName = function(name)
{
  var midiOutputs = new midi.output();
  for (var i = 0; i < midiOutputs.getPortCount(); i++)
  {
  	if (midiOutputs.getPortName(i).indexOf(name) !== -1) {
      midiOutputs.openPort(i);
      return midiOutputs;
  	}
  }
  return false;
}

module.exports = exports;
