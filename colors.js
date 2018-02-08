
var exports = {};

var Colors = function(output) {
  this.output = output;
};


Colors.prototype.setColor = function(template, index, value)
{
  this.output.sendMessage([240,0,32,41,2,17,120, template, index, value, 247]);
}



module.exports = Colors;
