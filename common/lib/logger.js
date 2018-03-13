let winston = require('winston');

let config = winston.config;
let logger = new (winston.Logger)({
  transports: [
  	new (winston.transports.Console)({
  		json: false,
  		timestamp: getDatetimeFormat,
      formatter: customConsoleFormatter
  	}),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'api-integracion-info.log',
      level: 'info',
      json: false,
  		timestamp: getDatetimeFormat,
      formatter: customFileFormatter
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'api-integracion-error.log',
      level: 'error',
      json: false,
  		timestamp: getDatetimeFormat,
      formatter: customFileFormatter
    })
  ]
});

function customConsoleFormatter (options) {
  // - Return string will be passed to logger.
  // - Optionally, use options.colorize(options.level, <string>) to
  //   colorize output based on the log level.
  return '[' + options.timestamp() + '] ' +
    config.colorize(options.level, '[' + options.level.toUpperCase() + ']') + ' ' +
    (options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}

function customFileFormatter (options) {
  // - Return string will be passed to logger.
  // - Optionally, use options.colorize(options.level, <string>) to
  //   colorize output based on the log level.
  return '[' + options.timestamp() + '] ' +
    '[' + options.level.toUpperCase() + ']' +
    (options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}

function getDatetimeFormat(){
  return (new Date()).toUTCString();
}

module.exports = logger;