var jsonfile = require('jsonfile');
var config = require('./config.json');

module.exports = {
  save: (data) => {
    jsonfile.writeFile(config.save_file, data);
  },
  read: (data) => {
    try {
      return jsonfile.readFileSync(config.save_file);
    } catch (e) {
      return {};
    }
  }
}
