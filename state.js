var events = require('./events.js');
var constants = require('./constants.js');
var _fakeTemplateNumber = 0;
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
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_YELLOW, constants.COLOR_YELLOW, constants.COLOR_YELLOW, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN]
];

events.on('setTemplate', (index) => {
  _fakeTemplateNumber = index;
});

events.on('turnedOrPushed', (y, x, value) => {
  _turningPushingStates[_fakeTemplateNumber][y][x] = value;
});

events.on('bottom_solo_button', (x) => {
  _buttons.soloButtons[x] ^= true;
  events.emit('update_colors');
});

events.on('bottom_mute_button', (x) => {
  _buttons.muteButtons[x] ^= true;
  events.emit('update_colors');
});

events.on('printAllStates', () => {
  console.log(_turningPushingStates);
})

events.on('button_up', (onOff) => {
  _buttons.up = onOff;
  events.emit('update_colors');
});

module.exports = {
  buttons: _buttons,
  template: () => { return _fakeTemplateNumber; },
  colors: () => { return _colors; }
};
