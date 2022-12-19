const fs = require("fs")
class Calendar{
    constructor(){
        this.title = null
        this.start = null
        this.__start = null
        this.end = null
        this.__end = null
        this.description = null
        this.geo = null
        this.location = null
        this.recurrence = null
        this.trigger = "-PT2H"
        this.download_name = null
    }

    AddStart(startdate){
        if(!this.CheckDate(startdate)) return this
        if(this.__end !== null && (new Date(startdate)) > (new Date(this.__end))) return this
        this.start = startdate.replaceAll("-", "").replaceAll(":", "")
        this.__start = startdate
        return this
    }

    AddEnd(enddate){
        if(!this.CheckDate(enddate)) return this
        if(this.__start !== null && (new Date(enddate)) < (new Date(this.__start))) return this
        this.end = enddate.replaceAll("-", "").replaceAll(":", "")
        this.__end = enddate
        return this
    }

    AddTitle(title){
        if(!title || typeof title !== "string" || title.length > 20) return this
        this.title = title
        return this
    }

    AddDescription(description){
        if(!description || typeof description !== "string" || description.length > 50) return this
        this.description = description
        return this
    }

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

    AddLocation(location){
        if(!location || typeof location !== "string") return this
        if(!location.includes(", ") && !location.includes("\\")) return this
        if(location.split(",").length !== 3) return
        if(location.includes(", ") && !location.includes("\\")) location = location.replaceAll(", ", "\\,")
        this.location = location
        return this
    }

    AddTriger(trigger){
        this.trigger = trigger
        return this
    }

    AddDownloadName(name){
        if(!name || typeof name !== "string" || name.length > 20) return this
        this.download_name = name
        return this
    }

    AddRecurrence(rythm, stop){
        if(typeof rythm !== "string") return this
        if(!(/(hourly|daily|weekly|monthly|yearly)/).test(rythm.toLowerCase())) return this
        this.recurrence = {FREQ: rythm.toUpperCase()}
        if(isNaN(stop)){
            if(!this.CheckDate(stop)) return this
            this.recurrence["UNTIL"] = stop.replaceAll("-", "").replaceAll(":", "")
        }else{
            if(String(Number(stop)).includes(".")) stop = String(Number(stop)).split(".")[0]
            this.recurrence["COUNT"] = stop
        }
        return this
    }

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
            let path = `${(restpath.startsWith("/") || restpath.startsWith("C:")) ? restpath : `${get_path(process.cwd(), restpath)}`}`
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

    async getDownloadInfos(restpath){
        return new Promise((resolve, reject) => {
            this.Download(restpath, true)
            .then(datas => resolve(datas))
            .catch(datas => reject(datas))
        })
    }

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
            {name: "EXRULE", value: this.exrule},
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

    ToBuffer(){
        let text = this.ToText()
        if(text === "Error") return text
        return Buffer.from(text, "utf-8")
    }

    CheckDate(da){
        if(!da || typeof da !== "string") return false
        if(!da.includes("-") || !da.includes("T") || !da.includes(":")) return false
        if(!da.split("-").length === 3 || !da.split(":").length === 3 || !da.split("T").length === 2) return false
        let first = da.split("-")
        if(isNaN(first[0]) || first[0].length !== 4) return false
        if(isNaN(first[1]) || Number(first[1]) > 12 || Number(first[1]) < 1) return false
        if((!first[2].includes("T") || !first[2].includes(":")) || isNaN(first[2].split("T")[0]) || Number(first[2].split("T")[0]) > 31 || Number(first[2].split("T")[0]) < 1) return false
        let second = da.split(":")
        if((!second[0].includes("T") || !second[0].includes("-")) || isNaN(second[0].split("T")[1]) || Number(second[0].split("T")[1]) > 23 || Number(second[0].split("T")[1]) < 1) return false
        if(isNaN(second[1]) || Number(second[1]) > 59 || Number(second[1]) < 0 || second[1].length === 1) return false
        if(isNaN(second[2]) || Number(second[2]) > 59 || Number(second[2]) < 0 || second[2].length === 1) return false
        return true
    }
}

module.exports = Calendar