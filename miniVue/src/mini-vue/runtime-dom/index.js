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
    }
}
// 确保单例
function ensureRender() {
    return renderer || createRenderer(renderOptions)
}
// 入口
export const createApp = (rootComponent) => {
  
   return ensureRender().createApp(rootComponent)
}