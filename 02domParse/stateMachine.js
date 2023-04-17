const {start, setEmitCallback} = require('./parseDom')
const html = `<html lang="en">
<head> 
    <title>Dom解析</title>
</head>
<body>
    <div id="app"></div>
    <div></div>
</body>
</html>`

let current = start
setEmitCallback ((token) => {
    if(!token.isClose) {
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
        stack.pop()
    }
}) 
const stack = [{type: 'document', children : []}]
for(let char of html) {
    // console.log(current.name)

    current = current(char)
}
console.log(JSON.stringify(stack, null, ' '))