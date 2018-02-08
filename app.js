var midi = require('midi');
var config = require('./config.json');
var Colors = require('./Colors.js');
var input = new midi.input();
var outputHUI = new midi.output();
var outputOctatrack = new midi.output();
var inputPort = false;
var outputHUIPort = false;
var outputOctatrackPort = false;

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
var outputColors = new Colors(outputHUI);
outputHUI.sendMessage([176+8, 0, 0]); // reset colors
outputHUI.sendMessage([240,0,32,41,2,17,119,8,247]); // set factory template

outputColors.setColor(8, 44, 58);
outputColors.setColor(8, 24, 58);

input.on('message', function(deltaTime, message) {
  //console.log('m:' + message + ' d:' + deltaTime);
	outputColors.setColor(8, 44, message[2]);
	outputColors.setColor(8, 1, message[2]);
	outputColors.setColor(8, 24, message[2]);
});

input.ignoreTypes(false, false, false);
input.openPort(inputPort);

outputOctatrack
console.log(outputOctatrack.getPortName(outputOctatrackPort), 'is the the Octatrack');
console.log(outputHUI.getPortName(outputHUIPort), 'is the port that is showing fancy lights');
console.log(input.getPortName(inputPort), 'is controlling Octatrack');
