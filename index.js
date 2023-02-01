const Cal = require("./Calendar")
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
exports.downloadCalendars = require("./utils").download
//possiblité de réunir des calendrier l'un dans l'autre, possiblité d'ajouter des dates d'exceptions aux calendars récurrents