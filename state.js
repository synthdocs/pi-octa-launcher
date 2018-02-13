var events = require('./events.js');
var constants = require('./constants.js');
var _fakeTemplateNumber = 0;
var _machineState = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];
var _turningPushingStates = [];
var _buttons = {
  up: false,
  down: false,
  left: false,
  right: false,
  soloButtons: [0,0,0,0,0,0,0,0],
  muteButtons: [0,0,0,0,0,0,0,0]
};

for (var i = 0; i < 8; i++) {
  _turningPushingStates.push([
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ]);
};

var _colors = [
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_AMBER, constants.COLOR_AMBER, constants.COLOR_AMBER],
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_AMBER, constants.COLOR_AMBER, constants.COLOR_AMBER],
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_YELLOW, constants.COLOR_YELLOW, constants.COLOR_YELLOW, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN],
  [constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW],
  [constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW]
];

var _blinkingCache = {};

var blinkingState = (y, x) =>  _blinkingCache[y + '_' + x];

events.on('setTemplate', (index) => {
  _fakeTemplateNumber = index;
  events.emit('update_select_template_colors');
});

events.on('setTemplate', () => {
  var currentTemplateMidi = _turningPushingStates[_fakeTemplateNumber];
  for (var y = 0; y < _machineState.length; y++) {
    for (var x = 0; x < _machineState[y].length; x++) {
      var diff = _machineState[y][x]-currentTemplateMidi[y][x];
      var minDiff = Math.abs(diff);

      if (!blinkingState(y, x) && minDiff>5) {
        events.emit('blinking_color', y, x, diff <= 0 ? 2 : 1);
      }
      if (blinkingState(y, x) && minDiff<5) {
        events.emit('blinking_color', y, x, -1);
      }
    }
  }
});

events.on('turnedOrPushed', (y, x, value) => {
  _machineState[y][x] = value;
  var minDiff = Math.abs(_turningPushingStates[_fakeTemplateNumber][y][x] - _machineState[y][x]);
  if (blinkingState(y, x) > 0) {
    if (minDiff < 10) {
      events.emit('blinking_color', y, x, -1);
    }
    return;
  }
  events.emit('octatrack_forward');
  _turningPushingStates[_fakeTemplateNumber][y][x] = value;
});

events.on('bottom_solo_button', (x) => {
  _buttons.soloButtons[x] ^= true;
  events.emit('update_solo_button_row');
  events.emit('update_colors');
});

events.on('bottom_mute_button', (x) => {
  _buttons.muteButtons[x] ^= true;
  events.emit('update_mute_button_row');
  events.emit('update_colors');
});

events.on('printAllStates', () => {
  console.log('_machineState', _machineState)
  console.log('templates', _turningPushingStates);
})

events.on('button_up', (onOff) => {
  _buttons.up = onOff;
  if (onOff) {
    events.emit('update_select_template_colors');
  } else {
    events.emit('update_solo_button_row');
    events.emit('update_mute_button_row');
  }
  events.emit('update_colors');
});

events.on('blinking_color', (y, x, blinking) => {
  var index = (y*8) + x;
  if (blinking > 0) {
    _blinkingCache[y + '_' + x] = blinking;
  } else {
    delete _blinkingCache[y + '_' + x];
  }
});

events.on('update_solo_button_row', () => {
  _buttons.soloButtons.forEach(function(item, index){
    _colors[3][index] = item ? constants.COLOR_GREEN : constants.COLOR_RED_LOW;
  })
});

events.on('update_mute_button_row', () => {
  _buttons.muteButtons.forEach(function(item, index){
     _colors[4][index] = item ? constants.OFF : constants.COLOR_RED_LOW;
  });
})

events.on('update_select_template_colors', () => {
  [0,0,0,0,0,0,0,0].forEach((item, index) => {
    _colors[3][index] = constants.OFF;
    _colors[4][index] = _fakeTemplateNumber === index ? constants.COLOR_RED : constants.COLOR_GREEN_LOW;
  })
})

module.exports = {
  buttons: _buttons,
  template: () => { return _fakeTemplateNumber; },
  colors: () => { return _colors; },
  blinking: () => { return _blinkingCache; }
};
