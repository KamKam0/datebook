const Calendar = require("./Calendar")
const fs = require("fs")
/**
 * 
 * @param {Calendar} Calendar
 * @returns {Buffer|null} 
 */
module.exports.toBuffer = (Calendar) => {
    if(((typeof Calendar === "object" && String(Calendar)!=="null") || typeof Calendar.toText !== "function") && typeof Calendar !== "string") return reject(null)
    let text = typeof Calendar !== "string" ? Calendar.toText() : Calendar
    if(text === "Error") return null
    return Buffer.from(text, "utf-8")
}

/**
 * @param {Calendar} Calendar
 * @param {string} restpath 
 * @returns {Promise<object>}
 */
module.exports.downloadInfos = async (Calendar, restpath) => {
    return new Promise((resolve, reject) => {
        if((typeof Calendar === "object" && String(Calendar)!=="null") || typeof Calendar.toText !== "function") return reject(null)
        this.download(Calendar, restpath, true)
        .then(datas => resolve(datas))
        .catch(datas => reject(datas))
    })
}


/**
 * @param {Calendar} Calendar
 * @param {string} restpath 
 * @param {boolean} state 
 * @async
 * @returns {Promise<string|object>} 
 */
module.exports.download = async (Calendar, restpath, state) => {
    return new Promise((resolve, reject) => {
        if(((typeof Calendar === "object" && String(Calendar)!=="null") || typeof Calendar.toText !== "function") && typeof Calendar !== "string") return reject(null)
        let text = typeof Calendar !== "string" ? Calendar.toText() : Calendar
        if(text === "Error") return reject(text)

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
            let name = 'multiplecalendars'
            if(typeof Calendar !== "string"){
                name = String(Calendar.start).split("T")[0]
                if(Calendar.download_name && Calendar.download_name.startsWith("#")) name+="-"+Calendar.download_name.slice(1)
                if(Calendar.download_name && !Calendar.download_name.startsWith("#")) name=Calendar.download_name
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