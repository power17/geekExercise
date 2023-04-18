/**
 * 开始状态
 * @param 输入状态
 * @return 下一个状态
 */
let tagToken 
let attributeNameStr = ''
let attributeValueStr = ''
let emit
function start(char) {
    if(char === '<') {
        return tag
    } else{
        return start
    }
}

function tag(char) {
    tagToken = {
        tagName : '',
        attribute: {},
        isClose: false
    }
    if(char === '/') {
        tagToken.isClose = true
        return closeTag
    } else {
        // tagToken.tagName += char
        return openTag(char)
    }

}

function text(char) {
    if(char === '<') {
        return start
    } else {
        return text
    }

}

function closeTag(char) {
    if(char === '>') {
        emit(tagToken)
        // console.log(tagToken)
        return start
    } else{
        tagToken.tagName += char
        return closeTag
    }
}
function openTag(char) {
    if(char === '>') {
        emit(tagToken)
        // console.log(tagToken)
        return start
    } else if(char === ' ') {
        return beforeAttribute
    }
    else {
        tagToken.tagName += char
        return openTag
    }
}
function beforeAttribute(char) {
    if(char == ' ') {
        return beforeAttribute
        
    }else if(char === '>') {
        emit(tagToken)
        // console.log(tagToken)
        return start
    }
    else{
        attributeNameStr = ''
        attributeValueStr = ''
        return attributeName(char)
       
    }
}

function attributeName(char) {
    if(char !== '=') {
        attributeNameStr += char
        return attributeName
    } else{
      
        return attributeValue
    }
}

function attributeValue(char) {
    if(char === '"') {
        return doubleQuote
    } else {
        throw new Errow("11111")
    }
}
function doubleQuote(char) {
    if(char === '"') {
        tagToken.attribute[attributeNameStr] = attributeValueStr
        return afterAttribute
    } else{
        attributeValueStr += char
        return doubleQuote
    }
}
function afterAttribute(char) {
    if(char === ' ') {
        return beforeAttribute
    } else if(char === '>') {
        // console.log(tagToken)
        emit(tagToken)
        return start
    }else{
        throw new Error('after')
    }
}
function setEmitCallback(cb) {
    emit = cb
}
module.exports = {start, setEmitCallback}
