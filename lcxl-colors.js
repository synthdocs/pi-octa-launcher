var events = require('./events.js');
var config = require('./config.json');
var constants = require('./constants.js');
var state = require('./state.js');
var midiDeviceFinder = require('./midi-device-finder.js');
var _lcxlMidiOutDevice = midiDeviceFinder.findOutputWithName(config.lcxloutput);

if (!_lcxlMidiOutDevice) {
  console.log('Missing devices');
  process.exit()
}

events.on('update_colors', () => {
  var _colors = state.colors();
  var knobColors = [];
  for (var y = 0; y < _colors.length; y++) {
    for (var x = 0; x < _colors[y].length; x++) {
      knobColors.push([(y * 8) + x, _colors[y][x]]);
    }
  }
  events.emit('setColors', knobColors);
});

var colorBlinker = (item, timeout = 250) => {
  var _colors = state.colors();
  var [y, x] = item.split('_');
  var saveColor = _colors[y][x],
    index = ((+y)*8) + (+x);
  events.emit('setColors', [[index, constants.COLOR_OFF]]);
  setTimeout(() => {
    events.emit('setColors', [[index, saveColor]]);
  }, timeout);
}

setInterval(() => {
  var _blinking = state.blinking();
  Object.keys(_blinking).filter((item) => _blinking[item] === 1).forEach((item) => {
    colorBlinker(item);
  })
}, 500)

setInterval(() => {
  var _blinking = state.blinking();
  Object.keys(_blinking).filter((item) => _blinking[item] === 2).forEach((item) => {
    colorBlinker(item, 125);
  })
}, 250)

events.emit('update_colors');
