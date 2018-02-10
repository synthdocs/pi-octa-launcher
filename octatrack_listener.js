var midi = require('midi');
var input = new midi.input();
var inputPort = false;

var midiDeviceFinder = require('./midi-device-finder.js');

midiDeviceFinder.listAllDevices();

input.on('message', function(deltaTime, message) {
  console.log(message);
});

input.ignoreTypes(false, false, false);
input.openPort(3);
