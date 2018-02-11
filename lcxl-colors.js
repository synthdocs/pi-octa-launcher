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

  if (state.buttons.up) {
    var muteColors = [0,0,0,0,0,0,0,0].map(function(item, index){
      return [32+index, state.template() === index ? constants.COLOR_RED : constants.COLOR_GREEN_LOW]
    });
  } else {
    var muteColors = state.buttons.muteButtons.map(function(item, index){
      return [32+index, item ? constants.OFF : constants.COLOR_RED_LOW]
    });
  }

  if (state.buttons.up) {
    var soloColors = state.buttons.soloButtons.map(function(item, index){
      return [24+index, constants.OFF]
    });
  } else {
    var soloColors = state.buttons.soloButtons.map(function(item, index){
      return [24+index, item ? constants.COLOR_GREEN : constants.COLOR_RED_LOW]
    });
  }

  events.emit('setColors', soloColors.concat(muteColors, knobColors));
});

events.emit('update_colors');
