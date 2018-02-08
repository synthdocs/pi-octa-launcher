var midi = require('midi');
var config = require('./config.json');
var colors = require('./colors.js');
var input = new midi.input();
var outputHUI = new midi.output();
var outputNotSynced = new midi.output();
var inputPort = null;
var outputHUIPort = null;
var outputNotSynPort = null;

for (var i = 0; i < input.getPortCount(); i++)
{
	console.log(input.getPortName(i), config.input);
	if (input.getPortName(i).indexOf(config.input) !== -1) {
		inputPort = i;
		break;
	}
}
for (var i = 0; i < outputHUI.getPortCount(); i++) {
	console.log(outputHUI.getPortName(i), config.output.hui);
	if (outputHUIPort === null && outputHUI.getPortName(i).indexOf(config.output.hui) !== -1) {
		outputHUIPort = i;
	}
}

// for (var i = 0; i < outputSynced.getPortCount(); i++)
// {
// 	if (outputSynced.getPortName(i).indexOf(config.output.notsync) !== -1) {
// 		outputNotSynPort = i;
// 	}
// 	if (outputSynced.getPortName(i).indexOf(config.output.sync) !== -1) {
// 		outputSynPort = i;
// 	}
// }
console.log(inputPort);
if (!inputPort && inputPort < 0) {
	for (var i = 0; i < input.getPortCount(); i++)
	{
			console.log(i, input.getPortName(i));
	}
	process.exit()
}

// console.log('Midi Input Port: ' + inputPort + ' ' + input.getPortName(inputPort));
// console.log('Midi Output Synced: ' + outputSynPort + ' ' + outputSynced.getPortName(outputSynPort));
// console.log('Midi Output Not Synced: ' + outputNotSynPort + ' ' + outputNotSynced.getPortName(outputNotSynPort));
//
// outputNotSynced.openPort(outputNotSynPort);
outputHUI.openPort(outputHUIPort);
var outputColors = new colors(outputHUI);
outputHUI.sendMessage([176+8, 0, 0]); // reset colors
outputHUI.sendMessage([240,0,32,41,2,17,119,8,247]); // set factory 1

outputColors.setColor(8, 44, 58);
outputColors.setColor(8, 24, 58);


//


// Configure a callback.
input.on('message', function(deltaTime, message) {
  console.log('m:' + message + ' d:' + deltaTime);
  // if (message[0] < 248){
  // 	outputNotSynced.sendMessage(message);
  // }
  // outputSynced.sendMessage(message);

	// EVERYTHING ON!
	outputColors.setColor(8, 44, message[2]);
	outputColors.setColor(8, 1, message[2]);
	outputColors.setColor(8, 24, message[2]);
});

// Open the first available input port.

input.ignoreTypes(false, false, false);
input.openPort(inputPort);

console.log('port is open', inputPort);
