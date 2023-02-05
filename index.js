const Cal = require("./Classes/Calendar")
/**
 * @returns {Cal}
 */
exports.Calendar = Cal
/**
 * @returns {string}
 */
exports.verison = require("./package.json").version
/**
 * @param {object[]} calendars Array of Calendar
 * @returns {string}
 */
exports.joinCalendars = require("./joinCalendars")