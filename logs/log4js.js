const log4js = require('log4js');
const path = require('path');

log4js.configure({
    appenders: {
        logConsola: { type: 'console' },
        logWarning: { type: 'file', filename: `${path.join(__dirname, 'info.log')}` },
        logError: { type: 'file', filename: `${path.join(__dirname, 'error.log')}` }
    },
    categories: {
        warning: { appenders: ['logWarning'], level: "info" },
        error: { appenders: ['logError'], level: "error" },
        default: { appenders: ['logConsola'], level: "trace" }
    }
})

const loggerDefault = log4js.getLogger();
const loggerWarn = log4js.getLogger('warning');
const loggerError = log4js.getLogger('error');

module.exports = { loggerDefault, loggerWarn, loggerError };

// EJEMPLOS DE USO:

// logger.trace('Trace message');
// log4js.getLogger('warning').trace('Trace message');
// log4js.getLogger('error').trace('Trace message');

// LOG LEVEL DEFAULT STAGES
// 1- trace: The most verbose level. Used for tracing application code to help with debugging.
// 2- debug: Used for debugging application code.
// 3- info: Used for informational messages.
// 4- warn: Used for warning messages.
// 5- error: Used for error messages.
// 6- fatal: The least verbose level. Used for critical error messages that may cause the application to stop working.
