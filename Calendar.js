const fs = require("fs")
class Calendar{
    constructor(){
        this.title = null
        this.start = null
        this.end = null
        this.description = null
        this.geo = null
        this.location = null
        this.trigger = "-PT2H"
        this.download_name = null
    }

    AddStart(startdate){
        let che = this.CheckDate(startdate)
        if(!che) return this
        this.start = startdate
        return this
    }

    AddTitle(title){
        if(!title || typeof title !== "string" || title.length > 20) return this
        this.title = title
        return this
    }

    AddEnd(enddate){
        let che = this.CheckDate(enddate)
        if(!che) return this
        this.end = enddate
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

    async Download(restpath){
        if(!this.title || !this.start || !this.end) return 'Error Not Possible'

        let randomnumber = ""

        while(randomnumber.length < 20){
            randomnumber += Math.floor(Math.random() * 2345)
        }

        let text = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:autoprog/kamkam\nNAME:Work\nX-WR-CALNAME:Work\nTIMEZONE-ID:Europe/Paris\nX-WR-TIMEZONE:Europe/Paris\nBEGIN:VEVENT\nUID:-${randomnumber}\nSEQUENCE:0\nDTSTAMP:${new Date(Date.now())}\nDTSTART;TZID=Europe/Paris:${String(this.start).replaceAll("-", "").replaceAll(":", "")}\nDTEND;TZID=Europe/Paris:${String(this.end).replaceAll("-", "").replaceAll(":", "")}${this.title !== null ? `\nSUMMARY:${this.title}` : ""}${this.location !== null ? `\nLOCATION:${this.location}` : ""}${this.geo !== null ? `\nGEO:${this.geo}` : ""}\nBEGIN:VALARM\nACTION:DISPLAY${this.description !== null ? `\nDESCRIPTION:${this.description}` : ""}\nTRIGGER:${this.trigger}\nEND:VALARM\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`

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
    
                fs.writeFileSync(get_path(path, `${name}.ics`), text)
                return resolve(name)
            })
        })

    }

    ToText(){

        if(!this.title || !this.start || !this.end) return 'Error'

        let randomnumber = ""

        while(randomnumber.length < 20){
            randomnumber += Math.floor(Math.random() * 2345)
        }

        let text = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:autoprog/kamkam\nNAME:Work\nX-WR-CALNAME:Work\nTIMEZONE-ID:Europe/Paris\nX-WR-TIMEZONE:Europe/Paris\nBEGIN:VEVENT\nUID:-${randomnumber}\nSEQUENCE:0\nDTSTAMP:${new Date(Date.now())}\nDTSTART;TZID=Europe/Paris:${String(this.start).replaceAll("-", "").replaceAll(":", "")}\nDTEND;TZID=Europe/Paris:${String(this.end).replaceAll("-", "").replaceAll(":", "")}${this.title !== null ? `\nSUMMARY:${this.title}` : ""}${this.location !== null ? `\nLOCATION:${this.location}` : ""}${this.geo !== null ? `\nGEO:${this.geo}` : ""}\nBEGIN:VALARM\nACTION:DISPLAY${this.description !== null ? `\nDESCRIPTION:${this.description}` : ""}\nTRIGGER:${this.trigger}\nEND:VALARM\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`

        return text
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