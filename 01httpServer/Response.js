class Response {
    constructor() {
        this.headers = {}

    }
    parse(data) {
        const lineReg = /[^\r]*\r\n/g
        while(true) {
            let lineStr = lineReg.exec(data)
            // console.log(lineStr)
            if(!lineStr || lineStr[0]=== '\r\n') {
                break
            }
            if(lineStr && !(lineStr[0].startsWith('HTTP'))) {
                const [key, value ] = lineStr[0].split(': ')
                this.headers [key] = value
            }
        }
        while(true) {
            let lineStr = lineReg.exec(data)
            const start = lineReg.lastIndex
            const bodyStrLen = parseInt(lineStr, 16)
            if(bodyStrLen === 0|| !bodyStrLen) {
                break
            }
            console.log(data.slice(start, start+bodyStrLen))
            lineReg.lastIndex +=bodyStrLen
        }
        
    }

}
module.exports = Response