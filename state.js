var exports = {};
var _soloState = [false, false, false, false, false, false, false, false];
var _muteState = [false, false, false, false, false, false, false, false];

exports.getSoloState = function()
{
  return _soloState;
}

exports.toggleSoloState = function(index)
{
  _soloState[index] ^= true;
  return _soloState[index];
}

exports.getMuteState = function()
{
  return _muteState;
}

exports.toggleMuteState = function(index)
{
  _muteState[index] ^= true;
  return _muteState[index];
}

module.exports = exports;
