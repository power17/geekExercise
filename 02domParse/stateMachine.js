const css = require('css')
const {start, setEmitCallback} = require('./parseDom')
const html = `<html lang="en">
<head> 
    <title>Dom解析</title>
    <style>
        #app{ width: 100px;}
    </style>
</head>
<body>
    <div id="app"></div>
    <div></div>
</body>
</html>`

function applyStyle(element) {
    if(!StyleSheet) retun 
    console.log(StyleSheet)
}

let current = start
setEmitCallback ((token) => {
    if(token.type === 'text') {
        let children = stack[stack.length -1]['children']
        let textNode = null 
        if(children.length && children[children.length -1].type === 'text') {
            textNode = children[children.length -1]
            children[children.length -1].value = token.value
        }else{
            textNode = {
                type: "text",
                value: ''
            }
            children.push(textNode)
        }
        // console.log(token .value)
        textNode.value += token.value
    }else if(!token.isClose) {
        let element = {
            type: 'element',
            tagName: token.tagName,
            attributes: token.attribute,
            children: []
        }
        stack[stack.length -1]['children'].push(element)
        stack.push(element)

    }else {
       
        if(token.tagName !== stack[stack.length -1].tagName) {
            console.warn('missing match')
        }
        if(token.tagName === 'style') {
            console.log(JSON.stringify(stack[stack.length - 1].children[0].valu, null , ' '))
            const obj = css.parse(stack[stack.length - 1].children[0].value, {})
            console.log(obj)
        }
        stack.pop()
    }
}) 
const stack = [{type: 'document', children : []}]
for(let char of html) {
    // console.log(current.name)

    current = current(char)
}
console.log(JSON.stringify(stack, null, ' '))