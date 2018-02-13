var events = require('./events.js');
var config = require('./config.json');
var midiDeviceFinder = require('./midi-device-finder.js');
var output = midiDeviceFinder.findOutputWithName(config.octatrackoutput);
var input = midiDeviceFinder.findInputWithName(config.octatrackinput);

var yxToParameter = [
  [16, 17, 34, 35, 36, 40, 41, 42],
  [18, 19, 37, 37, 39, 43, 44, 45],
  [20, 21, 31, 32, 33, 22, 24, 26],
];

var parameterToXY = (() => {
  var tmp = {};
  for(var y = 0; y < 3; y++) {
    for (var x = 0; x < 8; x++) {
      tmp[yxToParameter[y][x]] = [y, x];
    }
  }
  return tmp;
})();

events.on('octatrack_forward_knobs', (channel, y, x, value) => {
  channel = 176 + channel;
  var parameter = yxToParameter[y] && yxToParameter[y][x];
  if (parameter) {
    output && output.sendMessage([channel, parameter, value]);
  }
});

events.on('octatrack_forward_fader', (channel, value) => {
  var channel = 176 + channel;
  output && output.sendMessage([channel, 46, value]);
});

events.on('octatrack_solo', (channel, onOff) => {
  var channel = 176 + channel;
  output && output.sendMessage([channel, 50, onOff ? 1 : 0]);
});

events.on('octatrack_mute', (channel, onOff) => {
  var channel = 176 + channel;
  output && output.sendMessage([channel, 49, onOff ? 1 : 0]);
});

input.on('message', (delta, message) => {
  var channel = message[0] - 176;

  // faders
  if (message[1] === 46) {
    events.emit('octatrack_fader', channel, message[2]);
    return ;
  }

  // all knobs
  var xy = parameterToXY[message[1]];
  if (xy) {
    events.emit('octatrack_knob', channel, xy[0], xy[1], message[2]);
    return;
  }

  // solo track
  if (message[1] === 50) {
    events.emit('bottom_solo_button', channel, message[2] > 0);
    return;
  }

  // mute track
  if (message[1] === 49) {
    events.emit('bottom_mute_button', channel, message[2] > 0);
    return;
  }
  console.log(message)
});
