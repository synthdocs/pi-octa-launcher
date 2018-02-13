var events = require('./events.js');
var midiDeviceFinder = require('./midi-device-finder.js');
var config = require('./config.json');
var state = require('./state.js');
var _lcxlMidiDevice = midiDeviceFinder.findInputWithName(config.lcxlinput);

if (!_lcxlMidiDevice) {
  console.log('Missing devices');
  process.exit()
}

var isFader = (control, parameter) => {
  return control === 184 && parameter > 76 && parameter < 85;
};

var isTemplateChange = (messages) => {
  var truth = [240,0,32,41,2,17,119];
  if (
    truth[0] === messages[0] &&
    truth[1] === messages[1] &&
    truth[2] === messages[2] &&
    truth[3] === messages[3] &&
    truth[4] === messages[4] &&
    truth[5] === messages[5] &&
    truth[6] === messages[6]
  ) {
    return true;
  }
  return false;
};

var isSoloButton = (control, parameter) => {
		if (control === 152) {
			if (parameter >= 41 && parameter <= 44) {
				return true;
			}
			if (parameter >= 57 && parameter <= 60) {
				return true;
			}
		}
		return false;
};

var isMuteButton = (control, parameter) => {
  if (control === 152) {
    if (parameter >= 73 && parameter <= 76) {
      return true;
    }
    if (parameter >= 89 && parameter <= 92) {
      return true;
    }
  }
  return false;
};

var isTrackMute = (parameter) => {
  return parameter === 106 || parameter === 58;
};

var isTrackSolo = (parameter) => {
  return parameter === 107 || parameter === 59;
};

var getKnob = (message) => {
  if (message[0] === 184) {
    if (13 <= message[1] && message[1] <= 20) {
      return [0, message[1] - 13];
    }
    if (29 <= message[1] && message[1] <= 36) {
      return [1, message[1] - 29];
    }
    if (49 <= message[1] && message[1] <= 56) {
      return [2, message[1] - 49];
    }
  }
  return false;
}

var getMuteButtonIndex = (parameter) => {
  return (parameter >= 73 && parameter <= 76) ? parameter - 73 : parameter - 85;
}

var getSoloButtonIndex = (parameter) => {
  return (parameter > 40 && parameter < 45) ? parameter - 41 :  parameter - 53;
}

_lcxlMidiDevice.on('message', (deltaTime, message) => {
  //console.log('message', message)
  if (isTemplateChange(message)) {
    console.log('changes real template', message)
    return;
  }

  // Faders
	if (isFader(message[0], message[1])) {
    events.emit('turnedOrPushed', 3, message[1] - 77,  message[2]);
		return;
	}

  var knob = getKnob(message)
  if (knob !== false) {
    events.emit('turnedOrPushed', knob[0], knob[1], message[2])
    return;
  }

  if(isSoloButton(message[0], message[1])) {
    if (state.buttons.up) {

    } else {
      events.emit('bottom_solo_button', getSoloButtonIndex(message[1]));
      events.emit('update_colors');
    }

    return;
  }

  if(isMuteButton(message[0], message[1])) {
    var muteButtonIndex = getMuteButtonIndex(message[1]);
    if (state.buttons.up) {
      events.emit('setTemplate', muteButtonIndex);
    } else {
      events.emit('bottom_mute_button', muteButtonIndex);
    }
    events.emit('update_colors');
    return;
  }

  if (isTrackMute(message[1])) {
    console.log('track mute', message[2] > 0);
    return;
  }

  if (isTrackSolo(message[1])) {
    console.log('track solo', message[2] > 0);
    return;
  }

  if (message[0] === 152 && message[1] === 108 && message[2] === 127 ) {
		events.emit('printAllStates');
    return;
	}

  if (message[0] === 184 && message[1] === 104) {
    events.emit('button_up', message[2] > 0);
  }

  if (message[0] === 184 && message[1] === 105) {
    events.emit('button_down', message[2] > 0);
  }


});
