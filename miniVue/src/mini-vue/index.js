export const createApp = (rootComponent) => {
    console.log(rootComponent)
    return {
        mount(selector) {
            // 创建根节点 
           let rootElement = document.querySelector(selector)
           // 附加
           rootElement.appendChild(rootComponent.render.call(rootComponent.data()))
        }
    }
}