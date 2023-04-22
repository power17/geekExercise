
import { effect, reactive } from "../reactive"
import { createVNode } from "./vNode"
// 创建渲染器
export function createRenderer(options) {
    const {createElement: hostCreateElement, insert: hostInsert} = options
    const render = (vnode, container) => {
        //  // 创建根节点 
        //  let container = options.querySelector(selector)
        //  // 数据响应式
        //  const observed = reactive(rootComponent.data())
        //  // 更新组件
        //  const updateComponentFn = () => {
        //     let el = rootComponent.render.call(observed)
        //     // 清除值
        //     options.setElementText(container, '')
        //     options.insert(container, el)
        //  }
        //  // 存储更新函数到依赖set上（激活副作用）
        //  effect(updateComponentFn)
        //  updateComponentFn()
        //  // 挂载函数
        //  if(rootComponent.mounted) {
        //     rootComponent.mounted.call(observed)
        //  }
        if(vnode) {
            patch(container._vnode || null, vnode, container)
        }
        container._vnode = vnode
    }

    const patch = (n1, n2, container) => {
        const { type } = n2
        if(typeof type === 'string') {
            // element
            processElement(n1, n2, container)
        }else{
            // component
            processComponent(n1, n2, container)
        }
    }

    const processComponent = (n1, n2, container) => {
        if(n1 === null) {
            // mount
            mountComponent(n2, container)
        }else  {
            // patch
        }
    }
    // 挂载三件事： 组件初始化，状态初始化，副作用安装
    const mountComponent = (initialVNode, container) => {
        const instance = {
            data: {},
            vnode: initialVNode,
            isMounted: false
        }
          // 初始化组件状态
        const {data: dataOptions} = instance.vnode.type //  ?
        instance.data = reactive(dataOptions())
        // 安装渲染函数副作用
        setupRenderEffect(instance, container)
    }
  
    const setupRenderEffect = (instance, container) => {
        // 声明组件更新函数
        const componentUpdateFn = () => {
            if(!instance.isMounted) {
                // 执行渲染函数
                const {render} = instance.vnode.type
                const vnode = render.call(instance.data)
                // 递归调用
                patch(null, vnode, container)
                if(instance.vnode.type.isMounted) {
                    // todo
                    instance.vnode.type.mounted.call(instance.data) 
                }else{
                    // 更新阶段
                }
            }
        }
        // 建立更新机制
        effect(componentUpdateFn)
        // 首次执行更新函数
        componentUpdateFn()
    }
    const processElement = (n1, n2, container) => {
        if(n1 === null) {
            // 创建阶段
            mountElement(n2, container)
        }else{

        }

    }

    const mountElement = (vnode, container) => {
       
        const el = (vnode.el = hostCreateElement(vnode.type)) //h2
    
        if(typeof vnode.children === 'string') {
            el.textContent = vnode.children
        }else{
            // 数组
            vnode.children.foreach(child => patch(null, child, el))
        }
        //    插入元素
        hostInsert(container, el)
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
            mount(container) {
                // 创建根组件vNode
                const vnode = createVNode(rootComponent)
                // 将虚拟dom转换成真实dom
               render(vnode, container)
            }
        }
        return app
    }
}