/**
 * @param {object[]} calendars Array of Calendar
 * @param {string} [name]
 * @returns {string|object}
 */
const Calendars = require("./Classes/Calendars")

module.exports = (calendars, name) => {
    if((!calendars || !Array.isArray(calendars)) || (calendars.filter(e => typeof e === "string" || ((typeof e === "object" && String(e)!=="null") && typeof e.toText === "function")).length !== calendars.length)) return null
    calendars = calendars.map(e => {
        if(typeof e === "object") e = e.toText()
        if(e === "Error") return ""
        return `BEGIN:VEVENT${e.split("BEGIN:VEVENT")[1].split("END:VEVENT")[0]}\nEND:VEVENT`
    }).join("\n").replaceAll("\n\n", "\n")
    return new Calendars(`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:KamKam1_0/datebook.js\n${calendars}\nEND:VCALENDAR`, name ?? null)
}