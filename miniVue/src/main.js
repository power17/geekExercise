import { createApp } from './mini-vue'
import { createVNode } from './mini-vue/runtime-core/vNode'
import './style.css'
// import App from './App.vue'

createApp({
    data() {
        return {
            title: ['hello mini Vue11', '1111','22222' ]
        }
    },
    mounted() {
        setTimeout(() => {
            this.title = ['wow', 'data change' ]
        }, 1000)
    },
    render() {
        if(Array.isArray(this.title)) {

            return createVNode('h3', 
            {}, 
            this.title.map((v) => createVNode('p', {}, v)))
        } else{
            return createVNode('h3', {}, this.title)
        }
       

    }
}).mount('#app')
