
import { effect, reactive } from "../reactive"
import { createVNode } from "./vNode"
// 创建渲染器
export function createRenderer(options) {
    const {
        createElement: hostCreateElement,
         insert: hostInsert,
         setElementText: hostSetElementText,
         removeElement: hostRemoveElement
        } = options
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
            // patchElement(n1, n2)
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
          // 执行渲染函数
          const {render} = instance.vnode.type
        // 声明组件更新函数
        const componentUpdateFn = () => {
            if(!instance.isMounted) {
                // 保持最新的虚拟dom 下次可以作为旧的vnode
                const vnode = (instance.subtree = render.call(instance.data))
                // 递归调用
                patch(null, vnode, container)
                if(instance.vnode.type.mounted) {
                    // todo
                    instance.vnode.type.mounted.call(instance.data) 
                }
                instance.isMounted = true
            }else{
                // 更新阶段
                // 旧
                const prevVNode = instance.subtree
                // 新的
                const nextVNode = render.call(instance.data) 
                // 保持新的
                instance.subtree = nextVNode

                patch(prevVNode, nextVNode)
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
            patchElement(n1,n2)
        }

    }

    const mountElement = (vnode, container) => {
       
        const el = (vnode.el = hostCreateElement(vnode.type)) //h2
    
        if(typeof vnode.children === 'string') {
            el.textContent = vnode.children
        }else{
            // 数组
            vnode.children.forEach(child => patch(null, child, el))
        }
        //    插入元素
        hostInsert(container, el)
    }

    // patch 
    const patchElement = (n1, n2) => {
        // 获取要更新的元素节点
        const el = n2.el = n1.el
        // 更新节点
        if(n1.type === n2.type) {
            const oldCh = n1.children
            const newCh = n2.children
            if(typeof oldCh === 'string') {
                if(typeof newCh === 'string') {
                    // 文本替换文本
                   if(newCh !== oldCh) {
                    hostSetElementText(el , newCh) 
                   }
                } else{
                    // 文本替换数组
                    hostSetElementText(el, '')
                    newCh.forEach(v => patch(null, v, el))
                }
            }else {
                if(typeof newCh === 'string') {
                    // 之前子元素是数组， 新的是字符串
                    hostSetElementText(el, newCh)
                }else{
                    // 变化前后都是数组
                    updateChildren(oldCh, newCh, el)
                }
            }
        }

    }

    const updateChildren = (oldCh, newCh, parentEle) => {
        const len = Math.min(oldCh.length, newCh.length)
        for(let i = 0; i < len; i++) {
            patch(oldCh[i], newCh[i])
        }
        if(oldCh.length < newCh.length) {
            // 新数组元素数组较长，则添加
            newCh.slice(len).forEach(child => patch(null, child, parentEle))
        } else{
            oldCh.slice(len).forEach(child => hostRemoveElement(child.el))
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