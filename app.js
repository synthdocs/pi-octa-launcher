var midi = require('midi');
var config = require('./config.json');
var Colors = require('./Colors.js');
var state = require('./state.js');
var lcxl = require('./lcxl.js');
var input = new midi.input();
var outputHUI = new midi.output();
var outputOctatrack = new midi.output();
var inputPort = false;
var outputHUIPort = false;

var soloState = [false, false, false, false, false, false, false, false];

for (var i = 0; i < input.getPortCount(); i++)
{
	if (input.getPortName(i).indexOf(config.input) !== -1) {
		inputPort = i;
		break;
	}
}
for (var i = 0; i < outputHUI.getPortCount(); i++) {
	if (outputHUI.getPortName(i).indexOf(config.hui) !== -1) {
		outputHUIPort = i;
		break;
	}
}
for (var i = 0; i < outputOctatrack.getPortCount(); i++) {
	if (outputOctatrack.getPortName(i).indexOf(config.octatrack) !== -1) {
		outputOctatrackPort = i;
		break;
	}
}

if (inputPort === false
	|| outputHUIPort === false
	|| outputOctatrackPort === false)
{
	for (var i = 0; i < input.getPortCount(); i++)
	{
			console.log('Inputs available:', i, input.getPortName(i));
	}

	for (var i = 0; i < outputHUI.getPortCount(); i++)
	{
			console.log('Outputs available:', i, outputHUI.getPortName(i));
	}

	for (var i = 0; i < outputOctatrack.getPortCount(); i++)
	{
			console.log('Octatrack available:', i, outputOctatrack.getPortName(i));
	}


	console.log('Update config.json to any of the above values');

	process.exit()
}

outputHUI.openPort(outputHUIPort);
outputOctatrack.openPort(outputOctatrackPort);
var outputColors = new Colors(outputHUI);


lcxl.init(outputHUI);

input.on('message', function(deltaTime, message) {

	// Faders
	if (lcxl.isFader(message[1])) {
		var fader = message[1] + 99;
		outputOctatrack.sendMessage([fader, 46, message[2]]);
		return;
	}

	if (lcxl.isSoloButton(message[0], message[1])) {
			var soloButtonIndex = lcxl.getSoloButtonIndex(message[1]);
			var newSoloButtonState = state.toggleSoloState(soloButtonIndex);
			outputOctatrack.sendMessage([176+soloButtonIndex, 50, newSoloButtonState ? 1 : 0]);
			lcxl.updateSoloState();
			return;
	}

	if (lcxl.isMuteButton(message[0], message[1])) {
		var muteButtonIndex = lcxl.getMuteButtonIndex(message[1]);
		var newMuteButtonState = state.toggleMuteState(muteButtonIndex);
		outputOctatrack.sendMessage([176+muteButtonIndex, 49, newMuteButtonState ? 1 : 0]);
		lcxl.updateMuteState();
		return;
	}

	console.log('m:' + message + ' d:' + deltaTime);
});
lcxl.switchToFactory();
lcxl.resetColors();
lcxl.updateSoloState();
lcxl.updateMuteState();
input.ignoreTypes(false, false, false);
input.openPort(inputPort);



console.log(outputOctatrack.getPortName(outputOctatrackPort), 'is the the Octatrack');
console.log(outputHUI.getPortName(outputHUIPort), 'is the port that is showing fancy lights');
console.log(input.getPortName(inputPort), 'is controlling Octatrack');
