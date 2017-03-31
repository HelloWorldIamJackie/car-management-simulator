var log = console.log;
var moment = require('moment')

consoleLog = function(){
  let date = moment().format('YYYY-MM-D h:mm:ss');
  log.apply(console, [`[${date}] `].concat(arguments[0]));
};

module.exports = consoleLog
