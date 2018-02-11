var midi = require('midi');
var config = require('./config.json');
var Colors = require('./Colors.js');
var state = require('./state.js');
var lcxl = require('./lcxl.js');
var ot = require('./octatrack.js');
var midiDeviceFinder = require('./midi-device-finder.js');
var outputOctatrack = new midi.output();
//input.openPort(inputPort);

var input = midiDeviceFinder.findInputWithName(config.input);
var outputHUI = midiDeviceFinder.findOutputWithName(config.hui);

var outputColors = new Colors(outputHUI);
lcxl.init(outputHUI);
ot.init();

input.on('message', function(deltaTime, message) {
	//console.log('m:' + message + ' d:' + deltaTime);
	// Change template? m:240,0,32,41,2,17,119,8,247
	if (lcxl.isTemplateChange(message)) {
		state.setCurrentTemplate(lcxl.whichTemplateOn(message));
		// lcxl.updateSoloState();
		// lcxl.updateMuteState();
		console.log('act on template change', state.getCurrentTemplate())
		return;
	}

	// Faders
	if (lcxl.isFader(message[0], message[1])) {
		var fader = message[1] + 99;
		state.updateFaderState(message[1] - 77,  message[2]);
		outputOctatrack.sendMessage([fader, 46, message[2]]);
		return;
	}

	var knob = lcxl.getKnob(message)
	if (knob !== false) {
		state.updateCurrentState(knob[0], knob[1],  message[2]);
		return;
	}

	if (lcxl.isSoloButton(message[0], message[1])) {
			var soloButtonIndex = lcxl.getSoloButtonIndex(message[1]);
			var newSoloButtonState = state.toggleSoloState(soloButtonIndex);
			ot.soloTrack(soloButtonIndex, newSoloButtonState);
			lcxl.updateSoloState();
			return;
	}

	if (lcxl.isMuteButton(message[0], message[1])) {
		var muteButtonIndex = lcxl.getMuteButtonIndex(message[1]);
		var newMuteButtonState = state.toggleMuteState(muteButtonIndex);
		ot.muteTrack(muteButtonIndex, newMuteButtonState);
		lcxl.updateMuteState();
		return;
	}

	// template mute
	if (message[1] === 106 || message[1] === 58) {
		state.setMuteState(state.getCurrentTemplate(), message[2] > 0);
		ot.muteTrack(state.getCurrentTemplate(), message[2] > 0);
		lcxl.updateMuteState();
		return;
	}

	// template solo
	if (message[1] === 107 || message[1] === 59) {
		state.setSoloState(state.getCurrentTemplate(), message[2] > 0);
		ot.soloTrack(state.getCurrentTemplate(), message[2] > 0);
		lcxl.updateSoloState();
		return;
	}

	// Use Record Arm for tracking
	if (message[0] === 144 && message[1] === 108 && message[2] === 127 ) {
		state.printAllStates();
	}

	console.log('m:' + message + ' d:' + deltaTime);
});
