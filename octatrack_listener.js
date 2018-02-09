var midi = require('midi');
var input = new midi.input();
var inputPort = false;



input.on('message', function(deltaTime, message) {
  console.log(message);
});

input.ignoreTypes(false, false, false);
input.openPort(3);
