var file = require('./file.js');
var midi = require('midi');
var events = require('./events.js');
var state = require('./state.js');
var lcxlOutput = require('./lcxl-output.js');
var lcxlColors = require('./lcxl-colors.js');
var octatrack = require('./octatrack.js');
var lcxl = require('./lcxl.js');

events.emit('clean_lcxl');
events.emit('update_all_colors');
events.emit('sync_octa_state');
