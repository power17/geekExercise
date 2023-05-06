const css = require('css')
const obj = css.parse('body{ font-size: 12px;}', {})
console.log(JSON.stringify(obj, null, ''))
let a ={
  "type": "stylesheet",
  "stylesheet": {
   "rules": [
    {
     "type": "rule",
     "selectors": [
      ".num"
     ],
     "declarations": [
      {
       "type": "declaration",
       "property": "width",
       "value": "100px",
       "position": {
        "start": {
         "line": 5,
         "column": 13
        },
        "end": {
         "line": 5,
         "column": 25
        }
       }
      },
      {
       "type": "declaration",
       "property": "display",
       "value": "block",
       "position": {
        "start": {
         "line": 6,
         "column": 13
        },
        "end": {
         "line": 6,
         "column": 27
        }
       }
      }
     ],
     "position": {
      "start": {
       "line": 4,
       "column": 9
      },
      "end": {
       "line": 7,
       "column": 10
      }
     }
    },
    {
     "type": "rule",
     "selectors": [
      ".num"
     ],
     "declarations": [
      {
       "type": "declaration",
       "property": "height",
       "value": "200px",
       "position": {
        "start": {
         "line": 9,
         "column": 13
        },
        "end": {
         "line": 9,
         "column": 26
        }
       }
      }
     ],
     "position": {
      "start": {
       "line": 8,
       "column": 9
      },
      "end": {
       "line": 10,
       "column": 10
      }
     }
    }
   ],
   "parsingErrors": []
  }
 }