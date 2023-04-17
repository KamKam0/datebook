class base{
    constructor(){}

    /**
     * 
     * @returns {Buffer}
     */
    toBuffer(){
        return require("../utils").toBuffer(this)
    }

    /**
     * 
     * @param {string} path 
     * @returns {Promise}
     */
    async download(path){
        return require("../utils").download(this, path)
    }

    /**
     * 
     * @param {string} path 
     * @returns {Promise}
     */
    async downloadInfos(path){
        return require("../utils").downloadInfos(this, path)
    }
}

module.exports = base