var config = require('./config.json');
var midiDeviceFinder = require('./midi-device-finder.js');
var exports = {};
var _output = null;

exports.init = function()
{
  _output = midiDeviceFinder.findOutputWithName(config.octatrack);
}

var sendMessage = function(control, parameter, value)
{
  _output && _output.sendMessage([control, parameter, value]);
}

exports.soloTrack = function(track, onOff)
{
  sendMessage(track, 49, onOff ? 1 : 0);
}

exports.muteTrack = function(track, onOff)
{
  sendMessage(track, 50, onOff ? 1 : 0);
}

exports.sendMessage = sendMessage;
module.exports = exports;
