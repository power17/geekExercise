
import { effect, reactive } from "../reactive"
// 创建渲染器
export function createRenderer(options) {
    const render = (rootComponent, selector) => {
         // 创建根节点 
         let container = options.querySelector(selector)
         // 数据响应式
         const observed = reactive(rootComponent.data())
         // 更新组件
         const updateComponentFn = () => {
            let el = rootComponent.render.call(observed)
            // 清除值
            options.setElementText(container, '')
            options.insert(container, el)
         }
         // 存储更新函数到依赖set上（激活副作用）
         effect(updateComponentFn)
         updateComponentFn()
         // 挂载函数
         if(rootComponent.mounted) {
            rootComponent.mounted.call(observed)
         }
       
        
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