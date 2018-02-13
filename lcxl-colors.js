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

setInterval(() => {
  var _colors = state.colors();
  state.blinking().forEach((row, y) => {
    row.forEach((column, x) => {
      if (column > 0) {
        var saveColor = _colors[y][x],
          index = (y*8) + x;
        events.emit('setColors', [[index, constants.COLOR_OFF]]);
        setTimeout(() => {
          events.emit('setColors', [[index, saveColor]]);
        }, 250);
      }
    })

  })
}, 500)



events.emit('update_colors');
