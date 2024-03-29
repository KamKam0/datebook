const calendar = require("./Classes/Calendar")
const fs = require("node:fs")
const os = require("node:os")

/**
 * 
 * @param {calendar} Calendar
 * @returns {Buffer|null} 
 */
module.exports.toBuffer = (Calendar) => {
    if((typeof Calendar === "object" && (String(Calendar)==="null" || typeof Calendar.toText !== "function")) || !["string", "object"].includes(typeof Calendar)) return reject(null)
    let text = typeof Calendar !== "string" ? Calendar.toText() : Calendar
    if(text === "Error") return null
    return Buffer.from(text, "utf-8")
}

/**
 * @param {calendar} Calendar
 * @param {string} restpath 
 * @returns {Promise<object>}
 */
module.exports.downloadInfos = async (Calendar, restpath) => {
    if(typeof Calendar === "object" && (String(Calendar)==="null" || typeof Calendar.toText !== "function")) return reject(null)
    return this.download(Calendar, restpath, true)
}


/**
 * @param {calendar} Calendar
 * @param {string} restpath 
 * @param {boolean} state 
 * @async
 * @returns {Promise<string|object>} 
 */
module.exports.download = async (Calendar, restpath, state) => {
    return new Promise((resolve, reject) => {
        if((typeof Calendar === "object" && (String(Calendar)==="null" || typeof Calendar.toText !== "function")) || !["string", "object"].includes(typeof Calendar)) return reject(null)
        let text = typeof Calendar !== "string" ? Calendar.toText() : Calendar
        if(text === "Error") return reject(text)

        function get_path(orpa, pa, name){
            if(!name){
                if(os.platform() === "darwin") return `${orpa}/${pa.replaceAll("\\", "/")}`
                if(os.platform() === "win32")  return `${orpa}\\${pa.replaceAll("/", "\\")}`
            }
            if(os.platform() === "darwin") return `${orpa}/${pa.replaceAll("\\", "/")}/${name.replaceAll("\\", "/")}`
            if(os.platform() === "win32")  return `${orpa}\\${pa.replaceAll("/", "\\")}\\${name.replaceAll("/", "\\")}`
        }
        let path = process.cwd()
        if(restpath) path = `${(restpath.startsWith("/") || restpath.startsWith("C:")) ? restpath : `${get_path(process.cwd(), restpath)}`}`
        fs.readdir(path, (err, files) => {
            if(err) return reject('Error path')
            let name = 'multiplecalendars'
            if(typeof Calendar !== "string"){
                name = String(Calendar.start).split("T")[0]
                if(Calendar.download_name && Calendar.download_name.startsWith("#")) name+="-"+Calendar.download_name.slice(1)
                if(Calendar.download_name && !Calendar.download_name.startsWith("#")) name=Calendar.download_name
                if(name === "undefined" && Calendar.content) name = "multiplecalendars"
                if(files.includes(`${name}.ics`)){
                    let totals = files.filter(e => e.startsWith(name)).map(e => e.split(name)[1].split(".")[0].replace("-", "")).filter(e => e !== "")
                    totals.sort((a,b)=>a-b)
                    name = `${name}-${String((totals[totals.length - 1] + 1)) === "NaN" ? "1" : (totals[totals.length - 1] + 1)}`
                }
            }

            if(state) return resolve({name, extension: "ics", buffer: this.toBuffer(Calendar)})

            fs.writeFileSync(get_path(path, `${name}.ics`), text)
            return resolve(name)
        })
    })

}