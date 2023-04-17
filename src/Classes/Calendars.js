const base = require("./base")
class Calendars extends base{
    /**
     * @param {string} content
     */
    constructor(content, download_name){
        super()
        /**
         * @param {string} content
         */
        this.content = content
        /**
         * @param {string} download_name
         */
        this.download_name = download_name
    }

    /**
     * 
     * @returns {string}
     */
    toText(){
        return this.content
    }
}

module.exports = Calendars