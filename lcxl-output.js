var events = require('./events.js');
var config = require('./config.json');
var midiDeviceFinder = require('./midi-device-finder.js');
var _lcxlMidiOutDevice = midiDeviceFinder.findOutputWithName(config.lcxloutput);
var template = 8;

if (!_lcxlMidiOutDevice) {
  console.log('Missing devices');
  process.exit()
}

events.on('initLCXL', () => {
  events.emit('forceTemplate');
});

events.on('forceTemplate', (nr = template) => {
  _lcxlMidiOutDevice.sendMessage([240,0,32,41,2,17,119,nr,247]);
});

events.on('setColors', (indexValuePairs) => {
  _lcxlMidiOutDevice.sendMessage([240 ,0 ,32 ,41 ,2 ,17 ,120, template]);
  for(i=0;i<indexValuePairs.length;i++) {
    _lcxlMidiOutDevice.sendMessage([indexValuePairs[i][0], indexValuePairs[i][1]]);
  }
  _lcxlMidiOutDevice.sendMessage([247]);
});

events.emit('initLCXL');
