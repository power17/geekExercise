const css = require('css')
const obj = css.parse('body{ font-size: 12px;}', {})
console.log(JSON.stringify(obj, null, ''))
