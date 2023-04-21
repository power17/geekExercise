import { createApp } from './mini-vue'
import { createVNode } from './mini-vue/runtime-core/vNode'
import './style.css'
// import App from './App.vue'

createApp({
    data() {
        return {
            title: 'hello mini Vue11'
        }
    },
    mounted() {
        setTimeout(() => {
            this.title = 'data change'
        }, 1000)
    },
    render() {
        return createVNode('h2', {}, 'hello mini vue')

    }
}).mount('#app')
