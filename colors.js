
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
Colors.GREEN = 28;
Colors.GREEN_LOW = 60;

Colors.prototype.setColor = function(template, index, value)
{
  this.output.sendMessage([
    240 ,0 ,32 ,41 ,2 ,17 ,120, template, index, value, 247
  ]);
}

module.exports = Colors;
