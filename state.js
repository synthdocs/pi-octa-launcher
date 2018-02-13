var events = require('./events.js');
var constants = require('./constants.js');
var file = require('./file.js');
var _fakeTemplateNumber = 0;
var _machineState = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];
var _turningPushingStates = [];
var _faderState = [0,0,0,0,0,0,0,0];
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
    [0,0,0,0,0,0,0,0]
  ]);
};

var _colors = [
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_AMBER, constants.COLOR_AMBER, constants.COLOR_AMBER],
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_AMBER, constants.COLOR_AMBER, constants.COLOR_AMBER],
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_YELLOW, constants.COLOR_YELLOW, constants.COLOR_YELLOW, constants.COLOR_GREEN, constants.COLOR_GREEN, constants.COLOR_GREEN],
  [constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_RED, constants.COLOR_RED],
  [constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW, constants.COLOR_RED_LOW]
];

var _blinkingCache = {};

var blinkingState = (y, x) =>  _blinkingCache[y + '_' + x];

events.on('setTemplate', (index) => {
  _fakeTemplateNumber = index;
  events.emit('update_select_template_colors');
});

events.on('setTemplate', () => {
  events.emit('knob_blinks_update');
  events.emit('fader_blinks_update');
});

events.on('knob_blinks_update', () => {
  var currentTemplateMidi = _turningPushingStates[_fakeTemplateNumber];
  for (var y = 0; y < 3; y++) {
    for (var x = 0; x < 8; x++) {
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

events.on('fader_blinks_update', () => {
  var faderIndex = 3;
  for(var x = 0; x < _faderState.length; x++) {
    var diff = _machineState[3][x]-_faderState[x];
    var minDiff = Math.abs(diff);

    if (!blinkingState(faderIndex, x) && minDiff>5) {
      events.emit('blinking_color', faderIndex, x, diff <= 0 ? 2 : 1);
    }
    if (blinkingState(faderIndex, x) && minDiff<5) {
      events.emit('blinking_color', faderIndex, x, -1);
    }
  }
})

events.on('lcxl_fader', (index, value) => {
  var y = 3;
  _machineState[y][index] = value;
  var minDiff = Math.abs(_faderState[index] - _machineState[y][index]);
  if(blinkingState(y, index) > 0){
    if (minDiff < 10) {
      events.emit('blinking_color', y, index, -1);
    }
    return;
  }
  _faderState[index] = value;
  events.emit('octatrack_forward_fader', index, value);
})

events.on('octatrack_fader', (index, value) => {
  _faderState[index] = value;
  events.emit('fader_blinks_update');
});

events.on('octatrack_knob', (channel, y, x, value) => {
  try {
    _turningPushingStates[channel][y][x] = value;
    events.emit('knob_blinks_update');
  } catch (e) {
    console.log('octatrack error', channel, y, x, value);
  }
});

events.on('fader', (index, value) => {
  _faderState[index] = value;
  events.emit('octatrack_forward_fader', index, value);
  events.emit('fader_blinks_update');
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
  events.emit('octatrack_forward_knobs', _fakeTemplateNumber, y, x, value);
  _turningPushingStates[_fakeTemplateNumber][y][x] = value;
});

events.on('bottom_solo_button_toggle', (x) => {
  events.emit('bottom_solo_button', x, !_buttons.soloButtons[x]);
});

events.on('bottom_solo_button', (x, onOff) => {
  _buttons.soloButtons[x] = onOff;
  events.emit('octatrack_solo', x, _buttons.soloButtons[x]);
  events.emit('update_solo_button_row');
  events.emit('update_colors');
})

events.on('bottom_mute_button_toggle', (x) => {
  events.emit('bottom_mute_button', x, !_buttons.muteButtons[x]);
});

events.on('bottom_mute_button', (x, onOff) => {
  _buttons.muteButtons[x] = onOff;
  events.emit('octatrack_mute', x, onOff);
  events.emit('update_mute_button_row');
  events.emit('update_colors');
});

events.on('printAllStates', () => {
  console.log('_machineState', _machineState)
  console.log('templates', _turningPushingStates);
})

var defaultColorRows = () => {
  events.emit('update_solo_button_row');
  events.emit('update_mute_button_row');
}

events.on('button_up', (onOff) => {
  _buttons.up = onOff;
  if (onOff) {
    events.emit('update_select_template_colors');
  } else {
    defaultColorRows()
  }
  events.emit('update_colors');
});

events.on('button_down', (onOff) => {
  _buttons.down = onOff;
  if (onOff) {
    events.emit('empty_bottom_colors');
  } else {
    defaultColorRows()
  }
  events.emit('update_colors');
})

events.on('button_left', (onOff) => {
  _buttons.left = onOff;
  if (onOff) {
    events.emit('empty_bottom_colors');
  } else {
    defaultColorRows()
  }
  events.emit('update_colors');
});

events.on('button_right', (onOff) => {
  _buttons.right = onOff;
  if (onOff) {
    events.emit('empty_bottom_colors');
  } else {
    defaultColorRows()
  }
  events.emit('update_colors');
});

events.on('solo_button', (onOff) => {
  _buttons.soloButtons[_fakeTemplateNumber] = onOff;
  events.emit('octatrack_solo', _fakeTemplateNumber, onOff);
  events.emit('update_solo_button_row');
  events.emit('update_colors');
});

events.on('mute_button', (onOff) => {
  _buttons.muteButtons[_fakeTemplateNumber] = onOff;
  events.emit('octatrack_mute', _fakeTemplateNumber, onOff);
  events.emit('update_mute_button_row');
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
  var hasSolo = _buttons.soloButtons.filter((item) => {
    return item;
  }).length > 0;

  _buttons.soloButtons.forEach(function(item, index){
    _colors[3][index] = item ? constants.COLOR_GREEN : hasSolo ? constants.COLOR_RED_LOW : constants.COLOR_RED;
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

events.on('empty_bottom_colors', () => {
  [0,0,0,0,0,0,0,0].forEach((item, index) => {
    _colors[3][index] = constants.OFF;
    _colors[4][index] = constants.OFF;
  })
})

events.on('update_all_colors', () => {
  events.emit('knob_blinks_update');
  events.emit('fader_blinks_update');
  events.emit('update_solo_button_row');
  events.emit('update_mute_button_row');
  events.emit('update_colors');
})

setInterval(() => {
  file.save({
    _machineState: _machineState,
    _turningPushingStates: _turningPushingStates,
    _fakeTemplateNumber: _fakeTemplateNumber,
    _buttons: _buttons,
    _blinkingCache: _blinkingCache,
    _faderState: _faderState
  });
}, 1000);


var data = file.read();
_buttons = data._buttons || _buttons;
_machineState = data._machineState || _machineState;
_turningPushingStates = data._turningPushingStates || _turningPushingStates;
_fakeTemplateNumber = data._fakeTemplateNumber || _fakeTemplateNumber;
_blinkingCache = data._blinkingCache || _blinkingCache;
_faderState = data._faderState || _faderState;

module.exports = {
  buttons: _buttons,
  template: () => { return _fakeTemplateNumber; },
  colors: () => { return _colors; },
  blinking: () => { return _blinkingCache; }
};
