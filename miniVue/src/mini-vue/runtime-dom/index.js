import { createRenderer } from "../runtime-core"
let renderer
// runtime-dom
// 创建 app实例    createApp(rootComponent).mount('#app')
const renderOptions = {
    querySelector(selector) {
        return document.querySelector(selector)
    },
    insert(parent, child, achor) {
        // 设置null则为appendchild
        return parent.insertBefore(child, achor || null)
    },
    setElementText(element, text) {
        element.textContent = text
    },
    createElement(tag) {
        return document.createElement(tag)
    },
    setElementText(el, text) {
        el.textContent =text
    },
    removeElement(el) {
        const parent = el.parentNode
        if(parent) {
            parent.removeChild(el)
        }
    }

}
// 确保单例
function ensureRender() {
    return renderer || createRenderer(renderOptions)
}
// 入口
export const createApp = (rootComponent) => { 
   const app = ensureRender().createApp(rootComponent)
   const mount = app.mount
   app.mount = function(containerOrSelector) {
    const container = document.querySelector(containerOrSelector)
    mount(container)
   }


   return app
}