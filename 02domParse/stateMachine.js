const css = require('css')
const {start, setEmitCallback} = require('./parseDom')
const html = `<html lang="en">
<head> 
    <title>Dom解析</title>
    <style>

        #app{
            width: 100px;
        }
        .app{
            width: 200px;
        }

        .num{
            width: 100px;
            display: block;
        }
        .num {
            height: 200px;
        }
    </style>
</head>
<body>
    <div class="app" id="app">文字文字
    <span class="num">12121</span>
    </div>
 
</body>
</html>`
let styleSheet = null

function applyStyle(element) {
    if(!styleSheet) return 
    // console.log(element)
    // console.log(styleSheet)
    let selectorStr = styleSheet.stylesheet.rules[0].selectors[0]
    for(let rule of styleSheet.stylesheet.rules) {
        selectorArr = rule.selectors[0].split(' ')
        const specificity = selectorMatch(selectorArr[selectorArr.length -1], element)
        if(specificity) {
            // console.log(JSON.stringify(styleSheet, null, ' '))
            const declarations = rule.declarations
            for(let declaration of declarations) {
                element.style = element.style || {}
                const old = element.style[declaration.property]
                const nextSpecificity = specificity.reduce((acc, cur) => cur + acc * 65536, 0)
                if(!old || nextSpecificity > old.specificity) {
                    element.style[declaration.property] = {
                        value: declaration.value,
                        specificity: nextSpecificity
                    }
                }
                console.log('element', element)
            }

            // console.log(selectorArr, 'matched', element )
        }
    }
}

   

function selectorMatch(selector, element) {
    // class id type
    // console.log(selector)
    const regExp = /#[a-z]+|\.[a-z]+|[a-z]+/g
    let word = null
    let specificity = [0, 0 , 0]
    while(word = regExp.exec(selector)) {
        if(word[0].charAt(0) === '#' ) {
            specificity[0] += 1
            // console.log(element)
            const id = element.attributes.id
            if(word[0].slice(1) !== id) {
                return false
            }

            
            
        }else if(word[0].charAt(0) === '.') {
            specificity[1] += 1
            // class
            if(!element.attributes.class) {return false}
            const classList = element.attributes.class.split(' ')
            if(!classList.includes(word[0].slice(1))) {
                return false
            }
        }else{
            specificity[2] += 1
            // type
            const tagName = element.tagName
            if(tagName !== word[0]) {
                return false
            }
        }
        


    }
    return specificity
}




// function check(arr) {
//     for(let i = 0; i < arr.length; i++) {
//         if(arr[i] <= 1) {
//             return false
//         }
//     }
//     return true
// }

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
        // 处理style
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
// html字符串处理
for(let char of html) {
    // console.log(current.name)

    current = current(char)
}
// console.log(JSON.stringify(stack, null, ' '))