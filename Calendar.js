const fs = require("fs")
class Calendar{
    #start;
    #end;
    constructor(){
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
        this.AddStart()
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
     * @param {string} restpath 
     * @param {boolean} state 
     * @async
     * @returns {Promise<string|object>} 
     */
    async Download(restpath, state){
        let text = this.ToText()
        if(text === "Error") return text

        return new Promise((resolve, reject) => {
            function get_path(orpa, pa, name){
                if(!name){
                    if(require("os").platform() === "darwin") return `${orpa}/${pa.replaceAll("\\", "/")}`
                    if(require("os").platform() === "win32")  return `${orpa}\\${pa.replaceAll("/", "\\")}`
                }
                if(require("os").platform() === "darwin") return `${orpa}/${pa.replaceAll("\\", "/")}/${name.replaceAll("\\", "/")}`
                if(require("os").platform() === "win32")  return `${orpa}\\${pa.replaceAll("/", "\\")}\\${name.replaceAll("/", "\\")}`
            }
            let path = process.cwd()
            if(restpath) path = `${(restpath.startsWith("/") || restpath.startsWith("C:")) ? restpath : `${get_path(process.cwd(), restpath)}`}`
            fs.readdir(path, (err, files) => {
                if(err) return reject('Error path')
                let name = String(this.start).split("T")[0]
                if(this.download_name && this.download_name.startsWith("#")) name+="-"+this.download_name.slice(1)
                if(this.download_name && !this.download_name.startsWith("#")) name=this.download_name
                if(files.includes(`${name}.ics`)){
                    let totals = files.filter(e => e.startsWith(name)).map(e => e.split(name)[1].split(".")[0].replace("-", "")).filter(e => e !== "")
                    totals.sort((a,b)=>a-b)
                    name = `${name}-${String((totals[totals.length - 1] + 1)) === "NaN" ? "1" : (totals[totals.length - 1] + 1)}`
                }

                if(state) return resolve({name, extension: "ics", buffer: this.ToBuffer()})
    
                fs.writeFileSync(get_path(path, `${name}.ics`), text)
                return resolve(name)
            })
        })

    }

    /**
     * 
     * @param {string} restpath 
     * @returns {Promise<object>}
     */
    async getDownloadInfos(restpath){
        return new Promise((resolve, reject) => {
            this.Download(restpath, true)
            .then(datas => resolve(datas))
            .catch(datas => reject(datas))
        })
    }

    /**
     * 
     * @returns {string}
     */
    ToText(){

        //let text1 = `BEGIN:VCALENDAR;VERSION:2.0;PRODID:autoprog/kamkam;NAME:Work;X-WR-CALNAME:Work;TIMEZONE-ID:Europe/Paris;X-WR-TIMEZONE:Europe/Paris;BEGIN:VEVENT;UID:-${randomnumber};SEQUENCE:0;DTSTAMP:${new Date(Date.now())};DTSTART;TZID=Europe/Paris:${String(this.start).replaceAll("-", "").replaceAll(":", "")};DTEND;TZID=Europe/Paris:${String(this.end).replaceAll("-", "").replaceAll(":", "")}${this.title !== null ? `;SUMMARY:${this.title}` : ""}${this.location !== null ? `;LOCATION:${this.location}` : ""}${this.geo !== null ? `;GEO:${this.geo}` : ""};BEGIN:VALARM;ACTION:DISPLAY${this.description !== null ? `;DESCRIPTION:${this.description}` : ""};TRIGGER:${this.trigger};END:VALARM;STATUS:CONFIRMED;END:VEVENT;END:VCALENDAR`

        if(!this.title || !this.start || !this.end) return 'Error'

        let randomnumber = ""

        while(randomnumber.length < 20){
            randomnumber += Math.floor(Math.random() * 2345)
        }

        let datas = [
            {name: "BEGIN", value: "VCALENDAR"},
            {name: "VERSION", value: "2.0"},
            {name: "PRODID", value: "autoprog/kamkam"},
            {name: "NAME", value: "Work"},
            {name: "X-WR-CALNAME", value: "Work"},
            {name: "TIMEZONE-ID", value: "Europe/Paris"},
            {name: "X-WR-TIMEZONE", value: "Europe/Paris"},
            {name: "BEGIN", value: "VEVENT"},
            {name: "UID", value: "-"+randomnumber},
            {name: "SEQUENCE", value: "0"},
            {name: "DTSTAMP", value: new Date(Date.now())},
            {name: "DTSTART;TZID=Europe/Paris", value: this.start},
            {name: "DTEND;TZID=Europe/Paris", value: this.end},
            {name: "SUMMARY", value: this.title},
            {name: "LOCATION", value: this.location},
            {name: "GEO", value: this.geo},
            {name: "RRULE", value: this.recurrence},
            {name: "BEGIN", value: "VALARM"},
            {name: "ACTION", value: "DISPLAY"},
            {name: "TRIGGER", value: this.trigger},
            {name: "END", value: "VALARM"},
            {name: "STATUS", value: "CONFIRMED"},
            {name: "END", value: "VEVENT"},
            {name: "END", value: "VCALENDAR"}
        ]

        let text = datas.filter(da => da.value !== null && da.value !== undefined && da.value !== "").map(da => {
            if(typeof da.value === "string") return `${da.name}:${da.value}`
            else if(typeof da.value === "object") return `${da.name}:`+ Object.entries(da.value).filter(dat => dat[1] !== null && dat[1] !== undefined && dat[1] !== "").map(dat => `${dat[0]}=${dat[1]}`).join(";")
        }).join("\n")

        return text
    }

    /**
     * 
     * @returns {buffer}
     */
    ToBuffer(){
        let text = this.ToText()
        if(text === "Error") return text
        return Buffer.from(text, "utf-8")
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