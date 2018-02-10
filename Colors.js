
var state = require('./state.js');
var exports = {};

var Colors = function(output) {
  this.output = output;
};

Colors.OFF = 12;
Colors.RED_LOW = 13;
Colors.RED = 15;
Colors.AMBER_LOW = 29;
Colors.AMBER = 63;
Colors.YELLOW = 62;
Colors.GREEN = 56;
Colors.GREEN_LOW = 60;

Colors.prototype.setColor = function(template, index, value)
{
  this.setColors(template, [[index, value]]);
}

Colors.prototype.setColors = function(template, indexValuePairs)
{
  this.output.sendMessage([240 ,0 ,32 ,41 ,2 ,17 ,120, template]);
  for(i=0;i<indexValuePairs.length;i++) {
    this.output.sendMessage([indexValuePairs[i][0], indexValuePairs[i][1]]);
  }
  this.output.sendMessage([247]);
}

Colors.prototype.runBlinkingLoop = function()
{
  setInterval()
}

module.exports = Colors;
