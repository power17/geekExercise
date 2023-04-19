
// ---------------runtime-core-------------------
// 创建渲染器
export function createRenderer(options) {
    const render = (rootComponent, selector) => {
         // 创建根节点 
         let container = options.querySelector(selector)
         // 附加
         let el = rootComponent.render.call(rootComponent.data())
         options.insert(container, el)
    }
    return {
        render,
        createApp: createAppApi(render)
    }
}
// 创建实例
function createAppApi(render) {
    return function createApp(rootComponent) {
        const app = {
            mount(selector) {
               render(rootComponent, selector)
            }
        }
        return app
    }
}