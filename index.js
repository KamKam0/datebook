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
exports.calendars = {
    download: require("./utils").download,
    downloadInfos: require("./utils").downloadInfos,
    toBuffer: require("./utils").toBuffer
}