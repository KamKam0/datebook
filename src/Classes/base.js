const utils = require('../utils')

class base{
    constructor(){}

    /**
     * 
     * @returns {Buffer}
     */
    toBuffer(){
        return utils.toBuffer(this)
    }

    /**
     * 
     * @param {string} path 
     * @returns {Promise}
     */
    async download(path){
        return utils.download(this, path)
    }

    /**
     * 
     * @param {string} path 
     * @returns {Promise}
     */
    async downloadInfos(path){
        return utils.downloadInfos(this, path)
    }
}

module.exports = base