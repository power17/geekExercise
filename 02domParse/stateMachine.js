const css = require('css')
const {start, setEmitCallback} = require('./parseDom')
const html = `<html lang="en">
<head> 
    <title>Dom解析</title>
    <style>
        html body .app{ width: 100px;}
        .num{
            width: 100px;
            display: block;
        }
    </style>
</head>
<body>
    <div id="app">文字文字
    <span class="num">12121</span>
    </div>
 
</body>
</html>`
let styleSheet = null

function applyStyle(element) {
    if(!styleSheet) return 
    // console.log(element)
    let selectorStr = styleSheet.stylesheet.rules[0].selectors[0]
    let selectorArr = selectorStr.split(' ')
    selectorMathch(selectorArr[2], element)
}

function selectorMathch(selector, element) {
    // class id type
    console.log(selector)
    const regExp = /#[a-z]+|\.[a-z]+|[a-z]+/g
    let word = null
    while(word = regExp.exec(selector)) {
        if(word[0].charAt('#') ) {
            // id
        }else if(word[0].charAt('.')) {
            // class
        }else{
            // type
        }

    }
}

let current = start
setEmitCallback ((token) => {
    // 处理文本
    if(token.type === 'text') {
        let childrenArr = stack[stack.length -1].children
        let textNode = null 
        if(
            childrenArr.length && 
            childrenArr[childrenArr.length -1].type === 'text') {
            textNode = childrenArr[childrenArr.length -1]
            // childrenArr[childrenArr.length -1].value += token.value
        }else{
            textNode = {
                type: "text",
                value: ''
            }
            childrenArr.push(textNode)
        }
        textNode.value += token.value

    }else if(!token.isClose) {
        // 生成dom对象
        let element = {
            type: 'element',
            tagName: token.tagName,
            attributes: token.attribute,
            children: [],
            parent: stack[stack.length -1]
        }
        
        applyStyle(element)
        // console.log(JSON.stringify(stack, null, ' '), 11111)
        stack[stack.length -1]['children'].push(element)
        stack.push(element)

    }else {
        // 处理标签不匹配
        if(token.tagName !== stack[stack.length -1].tagName) {
            console.warn('missing match')
        }
        if(token.tagName === 'style') {
            const style = css.parse(stack[stack.length - 1].children[0].value, {})
            styleSheet = style
            
            
        }
        stack.pop()
    }
}) 
// 栈
const stack = [{type: 'document', children : []}]
for(let char of html) {
    // console.log(current.name)

    current = current(char)
}
// console.log(JSON.stringify(stack, null, ' '))