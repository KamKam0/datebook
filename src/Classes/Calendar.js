const base = require("./base")
class Calendar extends base{
    #start;
    #end;
    constructor(){
        super()
        /**
         * @param {(string|null)} title
         */
        this.title = null
        /**
         * @param {(string|null)} start
         */
        this.start = null
        /**
         * @private
         * @param {(string|null)}
         */
        this.#start = null
        /**
         * @param {(string|null)} end
         */
        this.end = null
        /**
         * @param {(string|null)} 
         * @private
         */
        this.#end = null
        /**
         * @param {(string|null)} description
         */
        this.description = null
        /**
         * @param {(string|null)} geo
         */
        this.geo = null
        /**
         * @param {(string|null)} location
         */
        this.location = null
        /**
         * @param {(string|null)} recurrence
         */
        this.recurrence = null
        /**
         * @param {string} trigger
         */
        this.trigger = "-PT2H"
        /**
         * @param {(string|null)} download_name
         */
        this.download_name = null
        /**
         * @param {object[]} execptionDates
         */
        this.execptionDates = []
    }

    /**
     * 
     * @param {string} startdate 
     * @returns {Calendar}
     */
    AddStart(startdate){
        startdate = this.#CheckDate(startdate)
        if(!startdate) return this
        if(this.#end !== null && (new Date(startdate)) > (new Date(this.#end))) return this
        this.start = startdate.replaceAll("-", "").replaceAll(":", "")
        this.#start = startdate
        return this
    }

    /**
     * 
     * @param {string} startdate 
     * @returns {Calendar}
     */
    AddEnd(enddate){
        enddate = this.#CheckDate(enddate)
        if(!enddate) return this
        if(this.#start !== null && (new Date(enddate)) < (new Date(this.#start))) return this
        this.end = enddate.replaceAll("-", "").replaceAll(":", "")
        this.#end = enddate
        return this
    }

    /**
     * 
     * @param {string} title 
     * @returns {Calendar}
     */
    AddTitle(title){
        if(!title || typeof title !== "string" || title.length > 20) return this
        this.title = title
        return this
    }

    /**
     * 
     * @param {string} description 
     * @returns {Calendar}
     */
    AddDescription(description){
        if(!description || typeof description !== "string" || description.length > 50) return this
        this.description = description
        return this
    }

    /**
     * 
     * @param {string} geolocation 
     * @returns {Calendar}
     */
    AddGeo(geolocation){
        if(!geolocation || typeof geolocation !== "string") return this
        if(!geolocation.includes(",") && !geolocation.includes(";")) return this
        if(geolocation.includes(" , ")) geolocation = geolocation.replace(" , ", ";")
        if(geolocation.includes(" , ")) geolocation = geolocation.replace(" , ", ";")
        if(geolocation.includes(", ")) geolocation = geolocation.replace(", ", ";")
        else if(geolocation.includes(",")) geolocation = geolocation.replace(",", ";")
        this.geo = geolocation
        return this
    }

    /**
     * 
     * @param {string} location 
     * @returns {Calendar}
     */
    AddLocation(location){
        if(!location || typeof location !== "string") return this
        if(!location.includes(", ") && !location.includes("\\")) return this
        if(location.split(",").length !== 3) return
        if(location.includes(", ") && !location.includes("\\")) location = location.replaceAll(", ", "\\,")
        this.location = location
        return this
    }

    /**
     * 
     * @param {string} location 
     * @returns {Calendar}
     */
    AddTriger(trigger){
        this.trigger = trigger
        return this
    }

    /**
     * 
     * @param {string} location 
     * @returns {Calendar}
     */
    AddDownloadName(name){
        if(!name || typeof name !== "string" || name.length > 20) return this
        this.download_name = name
        return this
    }

    /**
     * 
     * @param {string} rythm
     * @param {(string|number)} stop 
     * @returns {Calendar}
     */
    AddRecurrence(rythm, stop){
        if(typeof rythm !== "string") return this
        if(!(/(hourly|daily|weekly|monthly|yearly)/).test(rythm.toLowerCase())) return this
        this.recurrence = {FREQ: rythm.toUpperCase()}
        if(isNaN(stop)){
            stop = this.#CheckDate(stop)
            if(!stop) return this
            this.recurrence["UNTIL"] = stop.replaceAll("-", "").replaceAll(":", "")
        }else{
            if(String(Number(stop)).includes(".")) stop = String(Number(stop)).split(".")[0]
            this.recurrence["COUNT"] = stop
        }
        return this
    }

    /**
     * 
     * @param {string} date
     * @returns {Calendar} 
     */
    AddExceptionDate(date){
        date = this.#CheckDate(date)
        if(!date) return this
        this.execptionDates.push(date.replaceAll("-", "").replaceAll(":", ""))
    }

    /**
     * 
     * @returns {string}
     */
    toText(){
        if(!this.title || !this.start || !this.end) return 'Error'

        let randomnumber = ""

        while(randomnumber.length < 20){
            randomnumber += Math.floor(Math.random() * 2345)
        }

        let timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone
        let datas = [
            {name: "BEGIN", value: "VCALENDAR"},
            {name: "VERSION", value: "2.0"},
            {name: "PRODID", value: "-KamKam1_0/datebook.js"},
            {name: "NAME", value: this.title},
            {name: "X-WR-CALNAME", value: this.title},
            {name: "TIMEZONE-ID", value: timeZoneName},
            {name: "X-WR-TIMEZONE", value: timeZoneName},
            {name: "BEGIN", value: "VEVENT"},
            {name: "UID", value: "-"+randomnumber},
            {name: "SEQUENCE", value: "0"},
            {name: "DTSTAMP", value: this.#getDTDate()},
            {name: `DTSTART;TZID=${timeZoneName}`, value: this.start},
            {name: `DTEND;TZID=${timeZoneName}`, value: this.end},
            {name: "SUMMARY", value: this.title},
            {name: "LOCATION", value: this.location},
            {name: "GEO", value: this.geo},
            {name: "RRULE", value: this.recurrence},
            {name: "EXDATE", value: this.execptionDates},
            {name: "BEGIN", value: "VALARM"},
            {name: "ACTION", value: "DISPLAY"},
            {name: "TRIGGER", value: this.trigger},
            {name: "DESCRIPTION", value: this.description},
            {name: "END", value: "VALARM"},
            {name: "STATUS", value: "CONFIRMED"},
            {name: "END", value: "VEVENT"},
            {name: "END", value: "VCALENDAR"}
        ]

        let text = datas
        .filter(da => {
            if (!da.value) {
                return false
            }

            if ((typeof da.value === 'string' || Array.isArray(da.value)) && !da.value.length) {
                return null
            }

            return true
        })
        .map(da => {
            if(da.name.startsWith("EXDATE")) return da.value.map(e => `${da.name}:${e}`).join("\n")
            if(typeof da.value === "string") return `${da.name}:${da.value}`
            if(typeof da.value === "object") return `${da.name}:`+ Object.entries(da.value).filter(dat => dat[1] !== null && dat[1] !== undefined && dat[1] !== "").map(dat => `${dat[0]}=${dat[1]}`).join(";")
        })
        .join("\n")
        
        return text
    }

    #getDTDate(date=Date.now()){
        let processedDate = new Date(date)
        .toISOString()
        .split('-')
        .join('')
        .split(':')
        .join('')
        .split('.')[0]

        return processedDate+'Z'
    }

    /**
     * @private
     * @param {string} da 
     * @returns {string}
     */
    #CheckDate(da){
        if(!da || typeof da !== "string") return false
        let second;
        if(da.includes("T")){
            second = da.split("T")[1]
            if(second.length > 8 || !second.includes(":")) return false
            let splitted = second.split(":").filter(e => e !== "00")
            if(splitted.length > 3) return false
            if(splitted.filter(e => !isNaN(e) && [1, 2].includes(String(e).length) && Number(e) < 59 && Number(e) > 0).length !== splitted.length) return false
            if(Number(splitted[0]) > 24) return false
            second = splitted.map(e => String(e).length === 1 ? "0"+e : e)
            if(second.length === 1){
                second.push("00")
                second.push("00")
            }else second.push("00")
            second = second.join(":")
            da = da.split("T")[0]
        }
        if(!da.includes("/") && !da.includes("-")) return false
        if(da.includes("/")) da = treat(da, "/")
        if(da.includes("-")) da = treat(da, "-")
        if(!da) return false
        return `${da}${second ? "T"+second : "T01:00:00"}`

        function treat(dat, symb){
            if(dat.length < 8 || !dat.includes(symb)) return false
            let splitted = dat.split(symb)
            if(splitted.length !== 3) return false
            if(splitted.filter(e => !isNaN(e) && [1, 2, 4].includes(String(e).length) && Number(e) > 0).length !== splitted.length) return false
            if(String(splitted[0]).length === 2 || String(splitted[0]).length === 1) splitted = splitted.reverse()
            if(String(splitted[0]).length !== 4 || Number(splitted[1]) > 12 || Number(splitted[2]) > 31) return false
            dat = splitted.map(e => String(e).length === 1 ? "0"+e : e).join("-")
            return dat
        }
    }
}

module.exports = Calendar